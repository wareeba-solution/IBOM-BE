// src/api/services/import.service.js
const { sequelize } = require('../../models');
const fs = require('fs');
const path = require('path');
const csv = require('csv-parser');
const { Readable } = require('stream');
const AppError = require('../../utils/appError');
const auditService = require('./audit.service');

class ImportService {
  async createImportJob(jobData, userId) {
    try {
      // Create import job record in database (using a hypothetical ImportJob model)
      const importJob = await sequelize.models.ImportJob.create({
        sourceType: jobData.sourceType,
        sourceConfig: jobData.sourceConfig,
        entityType: jobData.entityType,
        mappingConfig: jobData.mappingConfig,
        validationRules: jobData.validationRules,
        onDuplicate: jobData.onDuplicate || 'error',
        batchSize: jobData.batchSize || 100,
        scheduledAt: jobData.scheduledAt,
        status: 'pending',
        createdBy: userId
      });
      
      // If not scheduled for later, process the import job immediately
      if (!jobData.scheduledAt) {
        // Queue the import job for processing
        // In a real implementation, you might use a job queue like Bull
        setTimeout(() => this.processImportJob(importJob.id), 100);
      }
      
      return importJob;
    } catch (error) {
      throw new AppError(`Failed to create import job: ${error.message}`, 500);
    }
  }

  async processImportJob(jobId) {
    const importJob = await sequelize.models.ImportJob.findByPk(jobId);
    
    if (!importJob || importJob.status !== 'pending') {
      return;
    }
    
    try {
      // Update job status to processing
      await importJob.update({ status: 'processing', startedAt: new Date() });
      
      // Get the data source
      const sourceData = await this.getSourceData(importJob.sourceType, importJob.sourceConfig);
      
      // Process the data in batches
      const result = await this.processData(
        sourceData,
        importJob.entityType,
        importJob.mappingConfig,
        importJob.validationRules,
        importJob.onDuplicate,
        importJob.batchSize
      );
      
      // Update job status based on results
      const status = result.errors.length > 0 
        ? (result.processed > 0 ? 'partially_completed' : 'failed')
        : 'completed';
      
      await importJob.update({
        status,
        completedAt: new Date(),
        recordsProcessed: result.processed,
        recordsFailed: result.errors.length,
        errorLog: result.errors.length > 0 ? JSON.stringify(result.errors) : null
      });
      
    } catch (error) {
      // Update job status to failed
      await importJob.update({
        status: 'failed',
        error: error.message,
        completedAt: new Date()
      });
    }
  }

  async getSourceData(sourceType, sourceConfig) {
    switch (sourceType) {
      case 'file':
        return this.getDataFromFile(sourceConfig);
      
      case 'api':
        return this.getDataFromApi(sourceConfig);
      
      case 'ftp':
        return this.getDataFromFtp(sourceConfig);
      
      case 's3':
        return this.getDataFromS3(sourceConfig);
      
      default:
        throw new AppError(`Unsupported source type: ${sourceType}`, 400);
    }
  }

  async getDataFromFile(config) {
    const { filePath, fileType } = config;
    
    if (!fs.existsSync(filePath)) {
      throw new AppError(`File not found: ${filePath}`, 404);
    }
    
    switch (fileType.toLowerCase()) {
      case 'csv':
        return this.parseCsvFile(filePath);
      
      case 'json':
        return this.parseJsonFile(filePath);
      
      case 'excel':
        return this.parseExcelFile(filePath);
      
      default:
        throw new AppError(`Unsupported file type: ${fileType}`, 400);
    }
  }

  async parseCsvFile(filePath) {
    return new Promise((resolve, reject) => {
      const results = [];
      
      fs.createReadStream(filePath)
        .pipe(csv())
        .on('data', (data) => results.push(data))
        .on('end', () => resolve(results))
        .on('error', (error) => reject(new AppError(`Failed to parse CSV file: ${error.message}`, 500)));
    });
  }

  async parseJsonFile(filePath) {
    try {
      const fileContent = fs.readFileSync(filePath, 'utf8');
      return JSON.parse(fileContent);
    } catch (error) {
      throw new AppError(`Failed to parse JSON file: ${error.message}`, 500);
    }
  }

  async parseExcelFile(filePath) {
    try {
      // This would require external libraries like exceljs or xlsx
      // Simplified placeholder implementation
      return [];
    } catch (error) {
      throw new AppError(`Failed to parse Excel file: ${error.message}`, 500);
    }
  }

  async getDataFromApi(config) {
    // Implementation would make API calls to external systems
    // This is a simplified placeholder
    return [];
  }

  async getDataFromFtp(config) {
    // Implementation would download and parse files from FTP server
    // This is a simplified placeholder
    return [];
  }

  async getDataFromS3(config) {
    // Implementation would download and parse files from S3 bucket
    // This is a simplified placeholder
    return [];
  }

  async processData(sourceData, entityType, mappingConfig, validationRules, onDuplicate, batchSize) {
    // Get the appropriate model based on entity type
    let model;
    switch (entityType) {
      case 'patients':
        model = require('../../models').Patient;
        break;
      case 'births':
        model = require('../../models').Birth;
        break;
      case 'deaths':
        model = require('../../models').Death;
        break;
      case 'immunizations':
        model = require('../../models').Immunization;
        break;
      case 'antenatalCare':
        model = require('../../models').AntenatalCare;
        break;
      case 'communicableDiseases':
        model = require('../../models').CommunicableDisease;
        break;
      case 'facilities':
        model = require('../../models').Facility;
        break;
      default:
        throw new AppError(`Unsupported entity type: ${entityType}`, 400);
    }
    
    // Process records
    const result = {
      processed: 0,
      errors: []
    };
    
    // Process in batches
    for (let i = 0; i < sourceData.length; i += batchSize) {
      const batch = sourceData.slice(i, i + batchSize);
      
      // Map and validate each record in the batch
      const processedBatch = batch.map((record, index) => {
        try {
          // Map record fields according to mapping configuration
          const mappedRecord = this.mapRecord(record, mappingConfig);
          
          // Validate record
          if (validationRules) {
            const validationErrors = this.validateRecord(mappedRecord, validationRules);
            if (validationErrors.length > 0) {
              throw new Error(`Validation failed: ${validationErrors.join(', ')}`);
            }
          }
          
          return mappedRecord;
        } catch (error) {
          result.errors.push({
            record: record,
            error: error.message,
            index: i + index
          });
          return null;
        }
      }).filter(record => record !== null);
      
      if (processedBatch.length > 0) {
        try {
          // Insert or update records in the database
          await this.saveRecords(model, processedBatch, onDuplicate);
          result.processed += processedBatch.length;
        } catch (error) {
          processedBatch.forEach((record, index) => {
            result.errors.push({
              record: record,
              error: error.message,
              index: i + index
            });
          });
        }
      }
    }
    
    return result;
  }

  mapRecord(record, mappingConfig) {
    const mappedRecord = {};
    
    // Apply field mappings
    Object.entries(mappingConfig.fields).forEach(([targetField, sourceField]) => {
      if (typeof sourceField === 'string') {
        // Direct field mapping
        mappedRecord[targetField] = record[sourceField];
      } else if (typeof sourceField === 'object' && sourceField.transform) {
        // Transform field value
        const sourceValue = record[sourceField.field];
        mappedRecord[targetField] = this.transformValue(sourceValue, sourceField.transform);
      }
    });
    
    // Apply default values for missing fields
    if (mappingConfig.defaults) {
      Object.entries(mappingConfig.defaults).forEach(([field, defaultValue]) => {
        if (mappedRecord[field] === undefined || mappedRecord[field] === null || mappedRecord[field] === '') {
          mappedRecord[field] = defaultValue;
        }
      });
    }
    
    return mappedRecord;
  }

  transformValue(value, transform) {
    switch (transform.type) {
      case 'date':
        return this.transformDate(value, transform.format);
      
      case 'number':
        return this.transformNumber(value);
      
      case 'boolean':
        return this.transformBoolean(value, transform.trueValues);
      
      case 'map':
        return transform.mapping[value] || transform.default || value;
      
      case 'concat':
        return transform.fields.map(field => value[field] || '').join(transform.separator || '');
      
      default:
        return value;
    }
  }

  transformDate(value, format) {
    // Implementation would parse date string according to format
    // Simplified placeholder
    return new Date(value);
  }

  transformNumber(value) {
    return Number(value);
  }

  transformBoolean(value, trueValues = ['yes', 'true', '1', 'y']) {
    return trueValues.includes(String(value).toLowerCase());
  }

  validateRecord(record, validationRules) {
    const errors = [];
    
    // Check required fields
    if (validationRules.required) {
      validationRules.required.forEach(field => {
        if (record[field] === undefined || record[field] === null || record[field] === '') {
          errors.push(`Required field "${field}" is missing or empty`);
        }
      });
    }
    
    // Check field patterns
    if (validationRules.patterns) {
      Object.entries(validationRules.patterns).forEach(([field, pattern]) => {
        if (record[field] && !new RegExp(pattern).test(record[field])) {
          errors.push(`Field "${field}" does not match required pattern`);
        }
      });
    }
    
    // Check value ranges
    if (validationRules.ranges) {
      Object.entries(validationRules.ranges).forEach(([field, range]) => {
        const value = Number(record[field]);
        if (!isNaN(value)) {
          if (range.min !== undefined && value < range.min) {
            errors.push(`Field "${field}" is below minimum value ${range.min}`);
          }
          if (range.max !== undefined && value > range.max) {
            errors.push(`Field "${field}" is above maximum value ${range.max}`);
          }
        }
      });
    }
    
    return errors;
  }

  async saveRecords(model, records, onDuplicate) {
    switch (onDuplicate) {
      case 'skip':
        // Insert only records that don't already exist
        for (const record of records) {
          const existing = await model.findOne({ where: { [model.primaryKeyField]: record[model.primaryKeyField] } });
          if (!existing) {
            await model.create(record);
          }
        }
        break;
      
      case 'update':
        // Upsert each record
        for (const record of records) {
          await model.upsert(record);
        }
        break;
      
      case 'error':
        // Insert all records, let database handle duplicate key errors
        await model.bulkCreate(records, { validate: true });
        break;
      
      default:
        throw new AppError(`Unsupported duplicate handling strategy: ${onDuplicate}`, 400);
    }
  }

  async getImportJob(jobId) {
    const importJob = await sequelize.models.ImportJob.findByPk(jobId, {
      include: [
        {
          model: User,
          attributes: ['id', 'firstName', 'lastName', 'email']
        }
      ]
    });

    if (!importJob) {
      throw new AppError('Import job not found', 404);
    }

    return importJob;
  }

  // src/api/services/import.service.js (continued)
  async getImportJobs(filters = {}) {
    const { status, entityType, sourceType, page = 1, limit = 10 } = filters;
    
    const whereClause = {};
    
    if (status) {
      whereClause.status = status;
    }
    
    if (entityType) {
      whereClause.entityType = entityType;
    }
    
    if (sourceType) {
      whereClause.sourceType = sourceType;
    }
    
    const offset = (page - 1) * limit;
    
    const { rows, count } = await sequelize.models.ImportJob.findAndCountAll({
      where: whereClause,
      include: [
        {
          model: User,
          attributes: ['id', 'firstName', 'lastName', 'email']
        }
      ],
      order: [['createdAt', 'DESC']],
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

  async cancelImportJob(jobId) {
    const importJob = await this.getImportJob(jobId);
    
    if (importJob.status !== 'pending' && importJob.status !== 'processing') {
      throw new AppError('Cannot cancel import job that is not pending or processing', 400);
    }
    
    await importJob.update({
      status: 'cancelled',
      completedAt: new Date()
    });
    
    return importJob;
  }
}

module.exports = new ImportService();