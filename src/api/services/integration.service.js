// src/api/services/integration.service.js
const { Integration, User, sequelize } = require('../../models');
const { Op } = require('sequelize');
const AppError = require('../../utils/appError');
const auditService = require('./audit.service');

class IntegrationService {
  async createIntegration(integrationData, userId) {
    try {
      const integration = await Integration.create({
        ...integrationData,
        createdBy: userId
      });
      
      await auditService.logAction({
        action: 'create_integration',
        entityType: 'integration',
        entityId: integration.id,
        newValues: integrationData,
        userId
      });
      
      return integration;
    } catch (error) {
      throw new AppError(`Failed to create integration: ${error.message}`, 500);
    }
  }

  async getIntegrationById(id) {
    const integration = await Integration.findByPk(id, {
      include: [
        {
          model: User,
          as: 'creator',
          attributes: ['id', 'firstName', 'lastName', 'email']
        }
      ]
    });

    if (!integration) {
      throw new AppError('Integration not found', 404);
    }

    return integration;
  }

  async updateIntegration(id, updateData, userId) {
    const integration = await this.getIntegrationById(id);
    
    // Store old values for audit log
    const oldValues = integration.toJSON();
    
    await integration.update(updateData);
    
    await auditService.logAction({
      action: 'update_integration',
      entityType: 'integration',
      entityId: integration.id,
      oldValues,
      newValues: updateData,
      userId
    });
    
    return integration;
  }

  async deleteIntegration(id, userId) {
    const integration = await this.getIntegrationById(id);
    
    await integration.destroy();
    
    await auditService.logAction({
      action: 'delete_integration',
      entityType: 'integration',
      entityId: integration.id,
      oldValues: integration.toJSON(),
      userId
    });
    
    return { success: true };
  }

  async searchIntegrations(searchParams) {
    const { type, status, page = 1, limit = 10 } = searchParams;
    
    const whereClause = {};
    
    if (type) {
      whereClause.type = type;
    }
    
    if (status) {
      whereClause.status = status;
    }
    
    const offset = (page - 1) * limit;
    
    const { rows, count } = await Integration.findAndCountAll({
      where: whereClause,
      include: [
        {
          model: User,
          as: 'creator',
          attributes: ['id', 'firstName', 'lastName', 'email']
        }
      ],
      order: [['updatedAt', 'DESC']],
      limit,
      offset
    });
    
    return {
      data: rows,
      meta: {
        total: count,
        page,
        limit,
        totalPages: Math.ceil(count / limit)
      }
    };
  }

  async runIntegration(id, parameters, userId) {
    const integration = await this.getIntegrationById(id);
    
    // Check integration status
    if (integration.status !== 'active') {
      throw new AppError('Integration is not active', 400);
    }
    
    try {
      let result;
      
      // Execute integration based on type
      switch (integration.type) {
        case 'import':
          result = await this.executeImportIntegration(integration, parameters);
          break;
        case 'export':
          result = await this.executeExportIntegration(integration, parameters);
          break;
        case 'api':
          result = await this.executeApiIntegration(integration, parameters);
          break;
        case 'webhook':
          result = await this.executeWebhookIntegration(integration, parameters);
          break;
        default:
          throw new AppError(`Unsupported integration type: ${integration.type}`, 400);
      }
      
      // Update integration with success status
      await integration.update({
        lastRunAt: new Date(),
        lastRunStatus: 'success'
      });
      
      // Log the run action
      await auditService.logAction({
        action: 'run_integration',
        entityType: 'integration',
        entityId: integration.id,
        newValues: { parameters, result: 'success' },
        userId
      });
      
      return {
        status: 'success',
        message: `Integration ${integration.name} executed successfully`,
        data: result
      };
    } catch (error) {
      // Update integration with error status
      await integration.update({
        lastRunAt: new Date(),
        lastRunStatus: 'failed',
        lastErrorMessage: error.message
      });
      
      // Log the failed run
      await auditService.logAction({
        action: 'run_integration',
        entityType: 'integration',
        entityId: integration.id,
        newValues: { parameters, result: 'failed', error: error.message },
        userId
      });
      
      throw new AppError(`Integration execution failed: ${error.message}`, 500);
    }
  }

  // Integration type-specific execution methods
  async executeImportIntegration(integration, parameters) {
    // Implementation would depend on the specific import source and configuration
    // This is a simplified placeholder
    return {
      message: 'Import integration executed',
      recordsProcessed: 0
    };
  }

  async executeExportIntegration(integration, parameters) {
    // Implementation would depend on the specific export destination and configuration
    // This is a simplified placeholder
    return {
      message: 'Export integration executed',
      recordsExported: 0,
      outputLocation: null
    };
  }

  async executeApiIntegration(integration, parameters) {
    // Implementation would make API calls to external systems
    // This is a simplified placeholder
    return {
      message: 'API integration executed',
      apiResponse: null
    };
  }

  async executeWebhookIntegration(integration, parameters) {
    // Implementation would send webhook notifications
    // This is a simplified placeholder
    return {
      message: 'Webhook integration executed',
      webhookResponse: null
    };
  }
}

module.exports = new IntegrationService();