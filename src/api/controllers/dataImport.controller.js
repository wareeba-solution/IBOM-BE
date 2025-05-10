// src/api/controllers/dataImport.controller.js

const path = require('path');
const fs = require('fs').promises;
const dataImportService = require('../services/dataImport.service');
const exportService = require('../services/export.service');
const { validateInput } = require('../../utils/validator');
const {
  importOptionsSchema,
  analyzeOptionsSchema,
  exportOptionsSchema,
  reportOptionsSchema
} = require('../validators/dataImport.validator');
const { AppError } = require('../../utils/error');

class DataImportController {
  /**
   * Analyze uploaded file structure
   * @param {Object} req - Express request object
   * @param {Object} res - Express response object
   * @param {Function} next - Express next function
   */
  async analyzeFile(req, res, next) {
    try {
      const { error, value } = validateInput(analyzeOptionsSchema, req.query);
      if (error) {
        return res.status(400).json({ error: error.message });
      }
      
      if (!req.file) {
        return res.status(400).json({ error: 'No file uploaded' });
      }
      
      const filePath = req.file.path;
      const analysis = await dataImportService.analyzeFile(filePath);
      
      return res.status(200).json(analysis);
    } catch (error) {
      // Clean up temporary file
      if (req.file && req.file.path) {
        try {
          await fs.unlink(req.file.path);
        } catch (unlinkError) {
          console.error(`Failed to delete temporary file: ${unlinkError.message}`);
        }
      }
      
      next(error);
    }
  }
  
  /**
   * Import data from uploaded file
   * @param {Object} req - Express request object
   * @param {Object} res - Express response object
   * @param {Function} next - Express next function
   */
  async importData(req, res, next) {
    try {
      const { error, value } = validateInput(importOptionsSchema, req.body);
      if (error) {
        return res.status(400).json({ error: error.message });
      }
      
      if (!req.file) {
        return res.status(400).json({ error: 'No file uploaded' });
      }
      
      const filePath = req.file.path;
      const importResults = await dataImportService.importCSV(filePath, value);
      
      return res.status(200).json(importResults);
    } catch (error) {
      // Clean up temporary file if still exists
      if (req.file && req.file.path) {
        try {
          await fs.unlink(req.file.path);
        } catch (unlinkError) {
          // File may already be deleted by the service
          if (unlinkError.code !== 'ENOENT') {
            console.error(`Failed to delete temporary file: ${unlinkError.message}`);
          }
        }
      }
      
      next(error);
    }
  }
  
  /**
   * Get supported entities for import
   * @param {Object} req - Express request object
   * @param {Object} res - Express response object
   * @param {Function} next - Express next function
   */
  getSupportedEntities(req, res, next) {
    try {
      const entities = dataImportService.getSupportedEntities();
      return res.status(200).json(entities);
    } catch (error) {
      next(error);
    }
  }
  
  /**
   * Get entity schema for mapping
   * @param {Object} req - Express request object
   * @param {Object} res - Express response object
   * @param {Function} next - Express next function
   */
  getEntitySchema(req, res, next) {
    try {
      const { entity } = req.params;
      const schema = dataImportService.getEntitySchema(entity);
      return res.status(200).json(schema);
    } catch (error) {
      next(error);
    }
  }
  
  /**
   * Export data in specified format
   * @param {Object} req - Express request object
   * @param {Object} res - Express response object
   * @param {Function} next - Express next function
   */
  async exportData(req, res, next) {
    try {
      const { error, value } = validateInput(exportOptionsSchema, req.body);
      if (error) {
        return res.status(400).json({ error: error.message });
      }
      
      const { entity, format, filters, fields } = value;
      let exportResult;
      
      switch (format) {
        case 'csv':
          exportResult = await exportService.exportToCSV(entity, filters, fields);
          break;
        case 'excel':
          exportResult = await exportService.exportToExcel(entity, filters, fields);
          break;
        case 'pdf':
          exportResult = await exportService.exportToPDF(entity, filters, fields);
          break;
        default:
          return res.status(400).json({ error: 'Unsupported export format' });
      }
      
      // Return export result with download URL
      return res.status(200).json({
        ...exportResult,
        downloadUrl: `/api/data-import/download/${path.basename(exportResult.filePath)}`
      });
    } catch (error) {
      next(error);
    }
  }
  
  /**
   * Generate report
   * @param {Object} req - Express request object
   * @param {Object} res - Express response object
   * @param {Function} next - Express next function
   */
  async generateReport(req, res, next) {
    try {
      const { error, value } = validateInput(reportOptionsSchema, req.body);
      if (error) {
        return res.status(400).json({ error: error.message });
      }
      
      const { reportType, ...options } = value;
      const reportResult = await exportService.generateReport(reportType, options);
      
      // Return report result with download URL
      return res.status(200).json({
        ...reportResult,
        downloadUrl: `/api/data-import/download/${path.basename(reportResult.filePath)}`
      });
    } catch (error) {
      next(error);
    }
  }
  
  /**
   * Download exported file
   * @param {Object} req - Express request object
   * @param {Object} res - Express response object
   * @param {Function} next - Express next function
   */
  async downloadFile(req, res, next) {
    try {
      const { filename } = req.params;
      const filePath = path.join(__dirname, '../../../exports', filename);
      
      // Check if file exists
      try {
        await fs.access(filePath);
      } catch (error) {
        return res.status(404).json({ error: 'File not found' });
      }
      
      // Determine content type based on file extension
      const ext = path.extname(filename).toLowerCase();
      let contentType = 'application/octet-stream';
      
      if (ext === '.csv') {
        contentType = 'text/csv';
      } else if (ext === '.xlsx') {
        contentType = 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet';
      } else if (ext === '.pdf') {
        contentType = 'application/pdf';
      }
      
      // Set headers
      res.setHeader('Content-Type', contentType);
      res.setHeader('Content-Disposition', `attachment; filename="${filename}"`);
      
      // Stream the file
      const fileStream = fs.createReadStream(filePath);
      fileStream.pipe(res);
    } catch (error) {
      next(error);
    }
  }
  
  /**
   * Get supported entities for export
   * @param {Object} req - Express request object
   * @param {Object} res - Express response object
   * @param {Function} next - Express next function
   */
  getSupportedExportEntities(req, res, next) {
    try {
      const entities = exportService.getSupportedEntities();
      return res.status(200).json(entities);
    } catch (error) {
      next(error);
    }
  }
  
  /**
   * Get supported report types
   * @param {Object} req - Express request object
   * @param {Object} res - Express response object
   * @param {Function} next - Express next function
   */
  getSupportedReportTypes(req, res, next) {
    try {
      const reportTypes = exportService.getSupportedReportTypes();
      return res.status(200).json(reportTypes);
    } catch (error) {
      next(error);
    }
  }
}

module.exports = new DataImportController();