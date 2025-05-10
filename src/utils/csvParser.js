// src/utils/csvParser.js

const fs = require('fs');
const csv = require('csv-parser');
const { Transform } = require('stream');
const { createObjectCsvWriter } = require('csv-writer');

/**
 * Parse a CSV file and return the data as an array of objects
 * @param {string} filePath - Path to the CSV file
 * @param {Object} options - Parsing options
 * @returns {Promise<Array>} - Array of parsed objects
 */
const parseCSV = (filePath, options = {}) => {
  return new Promise((resolve, reject) => {
    const results = [];
    
    fs.createReadStream(filePath)
      .on('error', (error) => reject(error))
      .pipe(csv(options))
      .on('data', (data) => results.push(data))
      .on('end', () => resolve(results))
      .on('error', (error) => reject(error));
  });
};

/**
 * Create a transform stream to validate and transform CSV data
 * @param {Function} validateFn - Validation function
 * @param {Function} transformFn - Transform function
 * @returns {Transform} - Transform stream
 */
const createCSVTransform = (validateFn, transformFn) => {
  return new Transform({
    objectMode: true,
    transform(chunk, encoding, callback) {
      try {
        // Validate the data
        const validationResult = validateFn(chunk);
        if (!validationResult.valid) {
          return callback(null, {
            original: chunk,
            valid: false,
            errors: validationResult.errors
          });
        }

        // Transform the data
        const transformedData = transformFn ? transformFn(chunk) : chunk;
        
        callback(null, {
          original: chunk,
          transformed: transformedData,
          valid: true,
          errors: []
        });
      } catch (error) {
        callback(null, {
          original: chunk,
          valid: false,
          errors: [error.message]
        });
      }
    }
  });
};

/**
 * Process a CSV file with validation and transformation
 * @param {string} filePath - Path to the CSV file
 * @param {Function} validateFn - Validation function
 * @param {Function} transformFn - Transform function
 * @param {Object} options - CSV parsing options
 * @returns {Promise<Object>} - Processing results
 */
const processCSV = (filePath, validateFn, transformFn, options = {}) => {
  return new Promise((resolve, reject) => {
    const results = {
      valid: [],
      invalid: [],
      total: 0
    };
    
    fs.createReadStream(filePath)
      .on('error', (error) => reject(error))
      .pipe(csv(options))
      .pipe(createCSVTransform(validateFn, transformFn))
      .on('data', (data) => {
        results.total++;
        if (data.valid) {
          results.valid.push(data.transformed);
        } else {
          results.invalid.push({
            row: results.total,
            original: data.original,
            errors: data.errors
          });
        }
      })
      .on('end', () => resolve(results))
      .on('error', (error) => reject(error));
  });
};

/**
 * Write data to a CSV file
 * @param {string} filePath - Path to the output CSV file
 * @param {Array} data - Array of objects to write
 * @param {Array} headers - Array of header objects { id, title }
 * @returns {Promise<void>}
 */
const writeCSV = async (filePath, data, headers) => {
  const csvWriter = createObjectCsvWriter({
    path: filePath,
    header: headers
  });
  
  return csvWriter.writeRecords(data);
};

/**
 * Convert object keys to standardized format (lowercase with underscores)
 * @param {Object} obj - Object to normalize
 * @returns {Object} - Normalized object
 */
const normalizeHeaders = (obj) => {
  const normalized = {};
  
  for (const key in obj) {
    if (Object.prototype.hasOwnProperty.call(obj, key)) {
      // Convert to lowercase and replace spaces with underscores
      const normalizedKey = key.toLowerCase().replace(/\s+/g, '_');
      normalized[normalizedKey] = obj[key];
    }
  }
  
  return normalized;
};

module.exports = {
  parseCSV,
  processCSV,
  writeCSV,
  normalizeHeaders,
  createCSVTransform
};