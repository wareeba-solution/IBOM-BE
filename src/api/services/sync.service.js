// src/api/services/sync.service.js
const { OfflineSync, DeviceRegistration, sequelize } = require('../../models');
const deviceService = require('./device.service');
const AppError = require('../../utils/appError');

class SyncService {
  async processOfflineData(syncData, userId) {
    const { deviceId, entities } = syncData;

    // Verify device registration
    const device = await deviceService.getDeviceById(deviceId);
    if (device.userId !== userId) {
      throw new AppError('Device not registered to this user', 403);
    }

    // Process each entity in a transaction
    const result = await sequelize.transaction(async (transaction) => {
      const syncResults = [];

      for (const entity of entities) {
        try {
          // Create sync record
          const syncRecord = await OfflineSync.create({
            deviceId,
            entityType: entity.entityType,
            entityId: entity.entityId,
            operation: entity.operation,
            data: entity.data,
            userId,
            syncStatus: 'pending'
          }, { transaction });

          // Process the entity based on its type and operation
          const processedEntity = await this.processEntity(entity, userId, transaction);

          // Update sync record with server entity ID and status
          await syncRecord.update({
            serverEntityId: processedEntity.id,
            syncStatus: 'completed',
            syncDate: new Date()
          }, { transaction });

          syncResults.push({
            localEntityId: entity.entityId,
            serverEntityId: processedEntity.id,
            status: 'completed'
          });
        } catch (error) {
          // Create failed sync record
          const syncRecord = await OfflineSync.create({
            deviceId,
            entityType: entity.entityType,
            entityId: entity.entityId,
            operation: entity.operation,
            data: entity.data,
            userId,
            syncStatus: 'failed',
            errorMessage: error.message,
            syncDate: new Date()
          }, { transaction });

          syncResults.push({
            localEntityId: entity.entityId,
            serverEntityId: null,
            status: 'failed',
            error: error.message
          });
        }
      }

      // Update device's last sync date
      await deviceService.updateLastSyncDate(deviceId);

      return syncResults;
    });

    return result;
  }

  async processEntity(entity, userId, transaction) {
    const { entityType, operation, data, entityId } = entity;
    let model;

    // Get the appropriate model based on entity type
    switch (entityType) {
      case 'Patient':
        model = require('../../models').Patient;
        break;
      case 'Birth':
        model = require('../../models').Birth;
        break;
      case 'Death':
        model = require('../../models').Death;
        break;
      case 'Immunization':
        model = require('../../models').Immunization;
        break;
      case 'AntenatalCare':
        model = require('../../models').AntenatalCare;
        break;
      default:
        throw new AppError(`Unsupported entity type: ${entityType}`, 400);
    }

    // Process based on operation type
    switch (operation) {
      case 'create':
        return await model.create({ ...data, createdBy: userId }, { transaction });
      
      case 'update':
        const existingEntity = await model.findByPk(entityId, { transaction });
        if (!existingEntity) {
          // If entity doesn't exist on server, create it instead
          return await model.create({ ...data, id: entityId, createdBy: userId }, { transaction });
        }
        await existingEntity.update(data, { transaction });
        return existingEntity;
      
      case 'delete':
        const entityToDelete = await model.findByPk(entityId, { transaction });
        if (entityToDelete) {
          await entityToDelete.destroy({ transaction });
        }
        return { id: entityId };
      
      default:
        throw new AppError(`Unsupported operation: ${operation}`, 400);
    }
  }

  async getChanges(syncRequest, userId) {
    const { deviceId, lastSyncDate, entityTypes } = syncRequest;

    // Verify device registration
    const device = await deviceService.getDeviceById(deviceId);
    if (device.userId !== userId) {
      throw new AppError('Device not registered to this user', 403);
    }

    const changes = {};

    // Process each entity type
    for (const entityType of entityTypes) {
      let model;

      // Get the appropriate model based on entity type
      switch (entityType) {
        case 'Patient':
          model = require('../../models').Patient;
          break;
        case 'Birth':
          model = require('../../models').Birth;
          break;
        case 'Death':
          model = require('../../models').Death;
          break;
        case 'Immunization':
          model = require('../../models').Immunization;
          break;
        case 'AntenatalCare':
          model = require('../../models').AntenatalCare;
          break;
        default:
          continue; // Skip unsupported entity types
      }

      // Get changes since last sync
      const whereClause = {};
      if (lastSyncDate) {
        whereClause.updatedAt = {
          [sequelize.Op.gt]: new Date(lastSyncDate)
        };
      }

      const entities = await model.findAll({
        where: whereClause,
        paranoid: false // Include soft-deleted records
      });

      changes[entityType] = entities.map(entity => {
        const data = entity.toJSON();
        return {
          id: data.id,
          operation: data.deletedAt ? 'delete' : 'update',
          data: data.deletedAt ? null : data,
          timestamp: data.updatedAt
        };
      });
    }

    // Update device's last sync date
    await deviceService.updateLastSyncDate(deviceId);

    return changes;
  }

  async getSyncStatus(deviceId, userId) {
    // Verify device registration
    const device = await deviceService.getDeviceById(deviceId);
    if (device.userId !== userId) {
      throw new AppError('Device not registered to this user', 403);
    }

    // Get sync statistics
    const syncStats = await OfflineSync.findAll({
      attributes: [
        'syncStatus',
        [sequelize.fn('COUNT', sequelize.col('id')), 'count'],
        [sequelize.fn('MAX', sequelize.col('syncDate')), 'lastSyncDate']
      ],
      where: { deviceId },
      group: ['syncStatus']
    });

    // Get pending conflicts
    const conflicts = await OfflineSync.findAll({
      where: {
        deviceId,
        syncStatus: 'conflict'
      },
      order: [['createdAt', 'DESC']]
    });

    return {
      deviceId,
      lastSyncDate: device.lastSyncDate,
      stats: syncStats,
      pendingConflicts: conflicts
    };
  }

  async resolveConflict(conflictData, userId) {
    const { syncId, resolution, mergedData } = conflictData;

    const syncRecord = await OfflineSync.findByPk(syncId);
    if (!syncRecord) {
      throw new AppError('Sync record not found', 404);
    }

    // Verify user has permission
    if (syncRecord.userId !== userId) {
      throw new AppError('You do not have permission to resolve this conflict', 403);
    }

    // Process based on resolution type
    let result;
    switch (resolution) {
      case 'local':
        // Keep local changes
        result = await this.processEntity(
          {
            entityType: syncRecord.entityType,
            entityId: syncRecord.serverEntityId || syncRecord.entityId,
            operation: 'update',
            data: syncRecord.data
          },
          userId,
          null // No transaction here
        );
        break;
      
      case 'server':
        // Keep server changes
        result = { id: syncRecord.serverEntityId || syncRecord.entityId };
        break;
      
      case 'merged':
        // Apply merged data
        result = await this.processEntity(
          {
            entityType: syncRecord.entityType,
            entityId: syncRecord.serverEntityId || syncRecord.entityId,
            operation: 'update',
            data: mergedData
          },
          userId,
          null // No transaction here
        );
        break;
      
      default:
        throw new AppError(`Unsupported resolution: ${resolution}`, 400);
    }

    // Update sync record
    await syncRecord.update({
      syncStatus: 'completed',
      conflictResolution: resolution,
      syncDate: new Date()
    });

    return {
      syncId,
      resolution,
      entityId: result.id,
      status: 'resolved'
    };
  }
}

module.exports = new SyncService();