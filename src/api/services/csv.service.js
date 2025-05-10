// src/api/services/csv.service.js

const path = require('path');
const fs = require('fs').promises;
const { parseCSV, processCSV, normalizeHeaders } = require('../../utils/csvParser');
const db = require('../../models');
const { AppError } = require('../../utils/error');

// Helper function to infer data types from headers
const inferDataType = (header) => {
  // Convert header to lowercase for case-insensitive matching
  const lowerHeader = header.toLowerCase();
  
  // Date fields
  if (lowerHeader.includes('date') || lowerHeader.includes('dob')) {
    return 'date';
  }
  
  // Number fields
  if (
    lowerHeader.includes('age') ||
    lowerHeader.includes('count') ||
    lowerHeader.includes('number') ||
    lowerHeader.includes('quantity') ||
    lowerHeader.includes('amount') ||
    lowerHeader.includes('weight') ||
    lowerHeader.includes('height')
  ) {
    return 'number';
  }
  
  // Boolean fields
  if (
    lowerHeader.includes('is_') ||
    lowerHeader.includes('has_') ||
    lowerHeader.includes('active') ||
    lowerHeader.includes('enabled')
  ) {
    return 'boolean';
  }
  
  // Default to string
  return 'string';
};

// Helper function to convert string value to the appropriate data type
const convertValue = (value, dataType) => {
  if (value === null || value === undefined || value === '') {
    return null;
  }
  
  switch (dataType) {
    case 'date':
      // Try to parse the date
      const date = new Date(value);
      return isNaN(date) ? null : date;
    
    case 'number':
      // Remove commas and convert to number
      const num = Number(String(value).replace(/,/g, ''));
      return isNaN(num) ? null : num;
    
    case 'boolean':
      // Convert various string representations to boolean
      const boolStr = String(value).toLowerCase().trim();
      if (['true', 'yes', 'y', '1'].includes(boolStr)) {
        return true;
      }
      if (['false', 'no', 'n', '0'].includes(boolStr)) {
        return false;
      }
      return null;
    
    default:
      // Keep as string
      return String(value);
  }
};

class CSVService {
  /**
   * Analyze CSV file and return structure info
   * @param {string} filePath - Path to the CSV file
   * @returns {Promise<Object>} - CSV structure info
   */
  async analyzeCSV(filePath) {
    try {
      // Parse first 10 rows to analyze structure
      const sampleData = await parseCSV(filePath);
      const sampleSize = Math.min(10, sampleData.length);
      const sample = sampleData.slice(0, sampleSize);
      
      if (sample.length === 0) {
        throw new AppError('CSV file is empty', 400);
      }
      
      // Get normalized headers
      const firstRow = sample[0];
      const originalHeaders = Object.keys(firstRow);
      const normalizedHeaders = Object.keys(normalizeHeaders(firstRow));
      
      // Infer data types and collect basic stats
      const columnStats = {};
      
      originalHeaders.forEach((header, index) => {
        const normalizedHeader = normalizedHeaders[index];
        const inferredType = inferDataType(header);
        
        const columnValues = sample.map(row => row[header]).filter(val => val !== null && val !== undefined && val !== '');
        
        columnStats[normalizedHeader] = {
          originalName: header,
          dataType: inferredType,
          examples: columnValues.slice(0, 3),
          nonEmptyCount: columnValues.length,
          uniqueCount: new Set(columnValues).size
        };
      });
      
      return {
        totalRows: sampleData.length,
        sampleSize,
        headers: {
          original: originalHeaders,
          normalized: normalizedHeaders
        },
        columns: columnStats,
        mappableTo: this.suggestEntityMapping(normalizedHeaders)
      };
    } catch (error) {
      if (error instanceof AppError) {
        throw error;
      }
      throw new AppError(`Failed to analyze CSV file: ${error.message}`, 500);
    }
  }
  
  /**
   * Suggest entity mapping based on headers
   * @param {Array} headers - Normalized headers
   * @returns {string} - Suggested entity
   */
  suggestEntityMapping(headers) {
    // Convert headers to Set for faster lookup
    const headerSet = new Set(headers);
    
    // Define key fields for each entity
    const entitySignatures = {
      patient: ['first_name', 'last_name', 'gender', 'date_of_birth'],
      facility: ['name', 'type', 'lga', 'address'],
      birth_statistic: ['patient_id', 'facility_id', 'birth_date', 'birth_weight'],
      death_statistic: ['patient_id', 'facility_id', 'date_of_death', 'cause_of_death'],
      immunization: ['patient_id', 'vaccine_type', 'dose_number', 'administration_date'],
      antenatal_care: ['patient_id', 'facility_id', 'registration_date', 'edd'],
      disease_case: ['patient_id', 'disease_id', 'reporting_date', 'diagnosis_date'],
      family_planning_client: ['patient_id', 'facility_id', 'registration_date', 'client_type']
    };
    
    // Calculate match score for each entity
    const entityScores = {};
    
    for (const [entity, signature] in Object.entries(entitySignatures)) {
      let matchCount = 0;
      let totalSignatureFields = signature.length;
      
      signature.forEach(field => {
        if (headerSet.has(field)) {
          matchCount++;
        }
      });
      
      entityScores[entity] = matchCount / totalSignatureFields;
    }
    
    // Find the entity with the highest match score
    let bestMatch = null;
    let highestScore = 0;
    
    for (const [entity, score] of Object.entries(entityScores)) {
      if (score > highestScore) {
        highestScore = score;
        bestMatch = entity;
      }
    }
    
    // Return the best match if score is above threshold
    return highestScore >= 0.5 ? bestMatch : 'unknown';
  }
  
  /**
   * Validate a CSV row against a schema
   * @param {Object} row - CSV row data
   * @param {Object} schema - Validation schema
   * @returns {Object} - Validation result
   */
  validateRow(row, schema) {
    const errors = [];
    const requiredFields = schema.requiredFields || [];
    const uniqueFields = schema.uniqueFields || [];
    const validations = schema.validations || {};
    
    // Check required fields
    requiredFields.forEach(field => {
      if (!row[field] || row[field].trim() === '') {
        errors.push(`${field} is required`);
      }
    });
    
    // Validate each field according to schema
    for (const [field, value] of Object.entries(row)) {
      const fieldValidation = validations[field];
      
      if (fieldValidation) {
        // Validate data type
        if (fieldValidation.type) {
          const convertedValue = convertValue(value, fieldValidation.type);
          
          if (convertedValue === null && value !== null && value !== undefined && value !== '') {
            errors.push(`${field} must be a valid ${fieldValidation.type}`);
          }
        }
        
        // Validate min/max (for numbers)
        if (fieldValidation.type === 'number') {
          const numValue = convertValue(value, 'number');
          
          if (numValue !== null) {
            if (fieldValidation.min !== undefined && numValue < fieldValidation.min) {
              errors.push(`${field} must be at least ${fieldValidation.min}`);
            }
            
            if (fieldValidation.max !== undefined && numValue > fieldValidation.max) {
              errors.push(`${field} must be at most ${fieldValidation.max}`);
            }
          }
        }
        
        // Validate allowed values
        if (fieldValidation.allowedValues && value !== null && value !== undefined && value !== '') {
          if (!fieldValidation.allowedValues.includes(value)) {
            errors.push(`${field} must be one of: ${fieldValidation.allowedValues.join(', ')}`);
          }
        }
        
        // Validate regex pattern
        if (fieldValidation.pattern && value !== null && value !== undefined && value !== '') {
          const regex = new RegExp(fieldValidation.pattern);
          
          if (!regex.test(value)) {
            errors.push(`${field} does not match the required format`);
          }
        }
      }
    }
    
    return {
      valid: errors.length === 0,
      errors
    };
  }
  
  /**
   * Transform CSV row to match entity schema
   * @param {Object} row - CSV row data
   * @param {Object} mappings - Field mappings
   * @param {Object} dataTypes - Data type definitions
   * @returns {Object} - Transformed row
   */
  transformRow(row, mappings, dataTypes) {
    const transformedRow = {};
    
    // Apply field mappings
    for (const [csvField, entityField] of Object.entries(mappings)) {
      if (row[csvField] !== undefined) {
        // Get the data type for the entity field
        const dataType = dataTypes[entityField] || 'string';
        
        // Convert the value to the appropriate data type
        transformedRow[entityField] = convertValue(row[csvField], dataType);
      }
    }
    
    return transformedRow;
  }
  
  /**
   * Process CSV file for import
   * @param {string} filePath - Path to the CSV file
   * @param {Object} options - Import options
   * @returns {Promise<Object>} - Import results
   */
  async processCSVForImport(filePath, options) {
    const { 
      entity, 
      mappings, 
      schema, 
      dataTypes,
      hasHeaderRow = true 
    } = options;
    
    try {
      // Define validation function
      const validateFn = (row) => this.validateRow(row, schema);
      
      // Define transform function
      const transformFn = (row) => this.transformRow(row, mappings, dataTypes);
      
      // Process the CSV file
      const results = await processCSV(
        filePath,
        validateFn,
        transformFn,
        { skipLines: hasHeaderRow ? 1 : 0 }
      );
      
      return {
        ...results,
        entity
      };
    } catch (error) {
      throw new AppError(`Failed to process CSV file: ${error.message}`, 500);
    }
  }
}

module.exports = new CSVService();