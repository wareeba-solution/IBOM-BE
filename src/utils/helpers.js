const crypto = require('crypto');

/**
 * Common helper functions
 */
const helpers = {
  /**
   * Generate a random string
   * @param {Number} length - Length of the string
   * @returns {String} Random string
   */
  generateRandomString: (length = 10) => {
    return crypto.randomBytes(Math.ceil(length / 2))
      .toString('hex')
      .slice(0, length);
  },

  /**
   * Generate a unique identifier
   * @param {String} prefix - Prefix for the identifier
   * @returns {String} Unique identifier
   */
  generateUniqueId: (prefix = '') => {
    const timestamp = Date.now().toString();
    const random = Math.random().toString(36).substring(2, 10);
    return `${prefix}${timestamp}-${random}`;
  },

  /**
   * Generate a unique patient identifier
   * @param {String} facilityCode - Facility code
   * @returns {String} Patient identifier
   */
  generatePatientId: (facilityCode) => {
    const timestamp = Date.now().toString().slice(-6);
    const random = Math.random().toString(36).substring(2, 6).toUpperCase();
    return `${facilityCode}-${timestamp}-${random}`;
  },

  /**
   * Parse CSV data
   * @param {String} data - CSV data
   * @param {Object} options - Parsing options
   * @returns {Array} Parsed data
   */
  parseCSV: (data, options = {}) => {
    // Simple CSV parser
    // For production, use a robust library like csv-parser or papaparse
    const lines = data.split('\n');
    const headers = lines[0].split(',').map(header => header.trim());
    
    return lines.slice(1).map(line => {
      if (!line.trim()) return null;
      
      const values = line.split(',').map(value => value.trim());
      const row = {};
      
      headers.forEach((header, index) => {
        row[header] = values[index] || null;
      });
      
      return row;
    }).filter(Boolean);
  },

  /**
   * Format date to YYYY-MM-DD
   * @param {Date} date - Date object
   * @returns {String} Formatted date
   */
  formatDate: (date) => {
    return date.toISOString().split('T')[0];
  },

  /**
   * Calculate age from date of birth
   * @param {Date} dateOfBirth - Date of birth
   * @returns {Number} Age in years
   */
  calculateAge: (dateOfBirth) => {
    const today = new Date();
    const birthDate = new Date(dateOfBirth);
    let age = today.getFullYear() - birthDate.getFullYear();
    const m = today.getMonth() - birthDate.getMonth();
    
    if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
      age--;
    }
    
    return age;
  },

  /**
   * Sanitize input to prevent XSS
   * @param {String} input - Input string
   * @returns {String} Sanitized string
   */
  sanitizeInput: (input) => {
    if (!input || typeof input !== 'string') return input;
    
    return input
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#x27;')
      .replace(/\//g, '&#x2F;');
  },

  /**
   * Check if a string is valid JSON
   * @param {String} str - String to check
   * @returns {Boolean} True if valid JSON
   */
  isValidJSON: (str) => {
    try {
      JSON.parse(str);
      return true;
    } catch (e) {
      return false;
    }
  },

  /**
   * Paginate array
   * @param {Array} array - Array to paginate
   * @param {Number} page - Page number
   * @param {Number} limit - Items per page
   * @returns {Object} Paginated result
   */
  paginate: (array, page = 1, limit = 10) => {
    const startIndex = (page - 1) * limit;
    const endIndex = page * limit;
    const results = {};
    
    if (endIndex < array.length) {
      results.next = {
        page: page + 1,
        limit,
      };
    }
    
    if (startIndex > 0) {
      results.previous = {
        page: page - 1,
        limit,
      };
    }
    
    results.total = array.length;
    results.totalPages = Math.ceil(array.length / limit);
    results.currentPage = page;
    results.data = array.slice(startIndex, endIndex);
    
    return results;
  },
};

/**
 * Describe a database model to get its columns
 * This is used to filter incoming data to only include valid columns
 * @param {Model} model - Sequelize model
 * @returns {Promise<Object>} Model description
 */
const describeModel = async (model) => {
  try {
    const result = await model.sequelize.query(
      `SELECT column_name FROM information_schema.columns WHERE table_name = '${model.tableName}'`
    );
    const columns = result[0].map((column) => column.column_name);
    return columns;
  } catch (error) {
    console.error('Error describing model:', error);
    return [];
  }
};

module.exports = helpers;