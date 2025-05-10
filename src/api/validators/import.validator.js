/**
 * Import validation schemas
 */
const Joi = require('joi');

// CSV import validation schema
const csvImportSchema = Joi.object({
  // Type of data being imported (required)
  dataType: Joi.string()
    .required()
    .valid(
      'patients', 
      'immunizations', 
      'births', 
      'deaths', 
      'antenatal', 
      'diseases', 
      'familyPlanning'
    )
    .messages({
      'any.required': 'Data type is required',
      'any.only': 'Invalid data type'
    }),
  
  // Options for importing data
  options: Joi.object({
    // Whether to update existing records or skip them
    updateExisting: Joi.boolean().default(false),
    
    // Whether to skip validation errors and continue importing
    skipErrors: Joi.boolean().default(false),
    
    // Whether to perform a dry run (validate but don't import)
    dryRun: Joi.boolean().default(false),
    
    // Facility ID to associate with imported data (if not in CSV)
    facilityId: Joi.string().uuid(),
    
    // Column mappings (if CSV headers don't match database fields)
    columnMappings: Joi.object().pattern(
      Joi.string(), 
      Joi.string()
    ),
  }).default({}),
});

// Excel import validation schema
const excelImportSchema = Joi.object({
  // Type of data being imported (required)
  dataType: Joi.string()
    .required()
    .valid(
      'patients', 
      'immunizations', 
      'births', 
      'deaths', 
      'antenatal', 
      'diseases', 
      'familyPlanning'
    )
    .messages({
      'any.required': 'Data type is required',
      'any.only': 'Invalid data type'
    }),
  
  // Options for importing data
  options: Joi.object({
    // Whether to update existing records or skip them
    updateExisting: Joi.boolean().default(false),
    
    // Whether to skip validation errors and continue importing
    skipErrors: Joi.boolean().default(false),
    
    // Whether to perform a dry run (validate but don't import)
    dryRun: Joi.boolean().default(false),
    
    // Facility ID to associate with imported data (if not in Excel)
    facilityId: Joi.string().uuid(),
    
    // Sheet name to import (if not specified, uses first sheet)
    sheetName: Joi.string(),
    
    // Column mappings (if Excel headers don't match database fields)
    columnMappings: Joi.object().pattern(
      Joi.string(), 
      Joi.string()
    ),
    
    // Whether the first row contains headers
    hasHeaderRow: Joi.boolean().default(true),
  }).default({}),
});

// JSON import validation schema
const jsonImportSchema = Joi.object({
  // Type of data being imported (required)
  dataType: Joi.string()
    .required()
    .valid(
      'patients', 
      'immunizations', 
      'births', 
      'deaths', 
      'antenatal', 
      'diseases', 
      'familyPlanning'
    )
    .messages({
      'any.required': 'Data type is required',
      'any.only': 'Invalid data type'
    }),
  
  // Options for importing data
  options: Joi.object({
    // Whether to update existing records or skip them
    updateExisting: Joi.boolean().default(false),
    
    // Whether to skip validation errors and continue importing
    skipErrors: Joi.boolean().default(false),
    
    // Whether to perform a dry run (validate but don't import)
    dryRun: Joi.boolean().default(false),
    
    // Facility ID to associate with imported data (if not in JSON)
    facilityId: Joi.string().uuid(),
  }).default({}),
});

// Import template validation schema
const importTemplateSchema = Joi.object({
  // Type of data template to get
  dataType: Joi.string()
    .required()
    .valid(
      'patients', 
      'immunizations', 
      'births', 
      'deaths', 
      'antenatal', 
      'diseases', 
      'familyPlanning'
    )
    .messages({
      'any.required': 'Data type is required',
      'any.only': 'Invalid data type'
    }),
  
  // Format of the template
  format: Joi.string()
    .valid('csv', 'excel', 'json')
    .default('csv')
    .messages({
      'any.only': 'Invalid format'
    }),
});

// Import status validation schema
const importStatusSchema = Joi.object({
  // Import job ID
  importId: Joi.string()
    .required()
    .uuid()
    .messages({
      'any.required': 'Import ID is required',
      'string.guid': 'Invalid import ID format'
    }),
});

module.exports = {
  csvImportSchema,
  excelImportSchema,
  jsonImportSchema,
  importTemplateSchema,
  importStatusSchema,
};