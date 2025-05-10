// src/api/services/dataImport.service.js

const path = require('path');
const fs = require('fs').promises;
const csvService = require('./csv.service');
const db = require('../../models');
const { AppError } = require('../../utils/error');
const { Sequelize } = require('sequelize');

class DataImportService {
  /**
   * Get import configuration for an entity
   * @param {string} entity - Entity name
   * @returns {Object} - Entity import configuration
   */
  getEntityConfig(entity) {
    // Define import configurations for each entity
    const entityConfigs = {
      patients: {
        requiredFields: ['first_name', 'last_name', 'gender', 'date_of_birth'],
        uniqueFields: [],
        model: db.Patient,
        dataTypes: {
          first_name: 'string',
          last_name: 'string',
          gender: 'string',
          date_of_birth: 'date',
          phone_number: 'string',
          email: 'string',
          address: 'string',
          next_of_kin: 'string',
          blood_group: 'string',
          allergies: 'string',
          chronic_conditions: 'string',
          is_deceased: 'boolean',
          date_of_death: 'date'
        },
        validations: {
          gender: {
            type: 'string',
            allowedValues: ['Male', 'Female']
          },
          date_of_birth: {
            type: 'date'
          },
          is_deceased: {
            type: 'boolean'
          },
          date_of_death: {
            type: 'date'
          }
        }
      },
      facilities: {
        requiredFields: ['name', 'type', 'lga'],
        uniqueFields: ['name'],
        model: db.Facility,
        dataTypes: {
          name: 'string',
          type: 'string',
          lga: 'string',
          ward: 'string',
          address: 'string',
          contact_person: 'string',
          phone_number: 'string',
          email: 'string',
          is_active: 'boolean'
        },
        validations: {
          type: {
            type: 'string',
            allowedValues: ['Hospital', 'Clinic', 'Health Center', 'Dispensary']
          },
          is_active: {
            type: 'boolean'
          }
        }
      },
      // src/api/services/dataImport.service.js (continued)

      birth_statistics: {
        requiredFields: ['patient_id', 'facility_id', 'birth_date'],
        uniqueFields: [],
        model: db.BirthStatistic,
        dataTypes: {
          patient_id: 'string',
          facility_id: 'string',
          birth_date: 'date',
          birth_time: 'string',
          delivery_type: 'string',
          birth_weight: 'number',
          apgar_score: 'string',
          complications: 'string',
          mother_id: 'string'
        },
        validations: {
          birth_date: {
            type: 'date'
          },
          birth_weight: {
            type: 'number',
            min: 0,
            max: 10
          },
          delivery_type: {
            type: 'string',
            allowedValues: ['Vaginal', 'Cesarean', 'Assisted', 'Other']
          }
        },
        foreignKeys: {
          patient_id: {
            model: 'Patient',
            field: 'id'
          },
          facility_id: {
            model: 'Facility',
            field: 'id'
          },
          mother_id: {
            model: 'Patient',
            field: 'id'
          }
        }
      },
      death_statistics: {
        requiredFields: ['patient_id', 'facility_id', 'date_of_death', 'primary_cause_of_death'],
        uniqueFields: [],
        model: db.DeathStatistic,
        dataTypes: {
          patient_id: 'string',
          facility_id: 'string',
          date_of_death: 'date',
          time_of_death: 'string',
          place_of_death: 'string',
          primary_cause_of_death: 'string',
          secondary_cause_of_death: 'string',
          manner_of_death: 'string'
        },
        validations: {
          date_of_death: {
            type: 'date'
          },
          manner_of_death: {
            type: 'string',
            allowedValues: ['Natural', 'Accident', 'Suicide', 'Homicide', 'Undetermined', 'Pending Investigation']
          }
        },
        foreignKeys: {
          patient_id: {
            model: 'Patient',
            field: 'id'
          },
          facility_id: {
            model: 'Facility',
            field: 'id'
          }
        }
      },
      immunizations: {
        requiredFields: ['patient_id', 'facility_id', 'vaccine_type', 'vaccine_name', 'administration_date'],
        uniqueFields: [],
        model: db.Immunization,
        dataTypes: {
          patient_id: 'string',
          facility_id: 'string',
          vaccine_type: 'string',
          vaccine_name: 'string',
          dose_number: 'number',
          administration_date: 'date',
          administered_by: 'string',
          batch_number: 'string',
          expiry_date: 'date',
          status: 'string'
        },
        validations: {
          administration_date: {
            type: 'date'
          },
          expiry_date: {
            type: 'date'
          },
          dose_number: {
            type: 'number',
            min: 1
          },
          status: {
            type: 'string',
            allowedValues: ['Scheduled', 'Administered', 'Missed', 'Cancelled']
          }
        },
        foreignKeys: {
          patient_id: {
            model: 'Patient',
            field: 'id'
          },
          facility_id: {
            model: 'Facility',
            field: 'id'
          }
        }
      },
      antenatal_care: {
        requiredFields: ['patient_id', 'facility_id', 'registration_date', 'lmp', 'edd'],
        uniqueFields: [],
        model: db.AntenatalCare,
        dataTypes: {
          patient_id: 'string',
          facility_id: 'string',
          registration_date: 'date',
          lmp: 'date',
          edd: 'date',
          gravida: 'number',
          para: 'number',
          status: 'string'
        },
        validations: {
          registration_date: {
            type: 'date'
          },
          lmp: {
            type: 'date'
          },
          edd: {
            type: 'date'
          },
          gravida: {
            type: 'number',
            min: 1
          },
          para: {
            type: 'number',
            min: 0
          },
          status: {
            type: 'string',
            allowedValues: ['Active', 'Completed', 'Transferred', 'Lost to Follow-up']
          }
        },
        foreignKeys: {
          patient_id: {
            model: 'Patient',
            field: 'id'
          },
          facility_id: {
            model: 'Facility',
            field: 'id'
          }
        }
      },
      disease_cases: {
        requiredFields: ['patient_id', 'disease_id', 'facility_id', 'reporting_date', 'diagnosis_date'],
        uniqueFields: [],
        model: db.DiseaseCase,
        dataTypes: {
          patient_id: 'string',
          disease_id: 'string',
          facility_id: 'string',
          reporting_date: 'date',
          diagnosis_date: 'date',
          onset_date: 'date',
          diagnosis_type: 'string',
          severity: 'string',
          outcome: 'string',
          status: 'string'
        },
        validations: {
          reporting_date: {
            type: 'date'
          },
          diagnosis_date: {
            type: 'date'
          },
          onset_date: {
            type: 'date'
          },
          diagnosis_type: {
            type: 'string',
            allowedValues: ['Clinical', 'Laboratory', 'Epidemiological', 'Presumptive']
          },
          severity: {
            type: 'string',
            allowedValues: ['Mild', 'Moderate', 'Severe', 'Critical']
          },
          outcome: {
            type: 'string',
            allowedValues: ['Recovered', 'Recovering', 'Deceased', 'Unknown', 'Lost to Follow-up']
          },
          status: {
            type: 'string',
            allowedValues: ['Active', 'Resolved', 'Deceased', 'Lost to Follow-up']
          }
        },
        foreignKeys: {
          patient_id: {
            model: 'Patient',
            field: 'id'
          },
          disease_id: {
            model: 'DiseaseRegistry',
            field: 'id'
          },
          facility_id: {
            model: 'Facility',
            field: 'id'
          }
        }
      },
      family_planning_clients: {
        requiredFields: ['patient_id', 'facility_id', 'registration_date', 'client_type', 'marital_status'],
        uniqueFields: [],
        model: db.FamilyPlanningClient,
        dataTypes: {
          patient_id: 'string',
          facility_id: 'string',
          registration_date: 'date',
          client_type: 'string',
          marital_status: 'string',
          number_of_children: 'number',
          status: 'string'
        },
        validations: {
          registration_date: {
            type: 'date'
          },
          client_type: {
            type: 'string',
            allowedValues: ['New Acceptor', 'Continuing User', 'Restart']
          },
          marital_status: {
            type: 'string',
            allowedValues: ['Single', 'Married', 'Divorced', 'Widowed', 'Separated', 'Other']
          },
          number_of_children: {
            type: 'number',
            min: 0
          },
          status: {
            type: 'string',
            allowedValues: ['Active', 'Inactive', 'Transferred', 'Lost to Follow-up']
          }
        },
        foreignKeys: {
          patient_id: {
            model: 'Patient',
            field: 'id'
          },
          facility_id: {
            model: 'Facility',
            field: 'id'
          }
        }
      }
    };
    
    return entityConfigs[entity] || null;
  }
  
  /**
   * Analyze uploaded file
   * @param {string} filePath - Path to the uploaded file
   * @returns {Promise<Object>} - Analysis results
   */
  async analyzeFile(filePath) {
    try {
      // Get file extension
      const fileExt = path.extname(filePath).toLowerCase();
      
      if (fileExt === '.csv') {
        // Analyze CSV file
        return await csvService.analyzeCSV(filePath);
      } else if (['.xls', '.xlsx'].includes(fileExt)) {
        // For Excel files, we'll convert to CSV first
        const csvFilePath = filePath.replace(fileExt, '.csv');
        // TODO: Add Excel to CSV conversion logic
        
        // Analyze the converted CSV
        return await csvService.analyzeCSV(csvFilePath);
      } else {
        throw new AppError('Unsupported file format', 400);
      }
    } catch (error) {
      if (error instanceof AppError) {
        throw error;
      }
      throw new AppError(`Failed to analyze file: ${error.message}`, 500);
    }
  }
  
  /**
   * Validate mapped fields against entity schema
   * @param {Object} mappings - Field mappings
   * @param {string} entity - Entity name
   * @returns {Object} - Validation result
   */
  validateFieldMappings(mappings, entity) {
    const entityConfig = this.getEntityConfig(entity);
    
    if (!entityConfig) {
      throw new AppError(`Unsupported entity: ${entity}`, 400);
    }
    
    const errors = [];
    const warnings = [];
    
    // Check if all required fields are mapped
    const mappedFields = Object.values(mappings);
    entityConfig.requiredFields.forEach(requiredField => {
      if (!mappedFields.includes(requiredField)) {
        errors.push(`Required field '${requiredField}' is not mapped`);
      }
    });
    
    // Check if any unknown fields are mapped
    const knownFields = Object.keys(entityConfig.dataTypes);
    mappedFields.forEach(field => {
      if (!knownFields.includes(field)) {
        warnings.push(`Unknown field '${field}' is mapped`);
      }
    });
    
    return {
      valid: errors.length === 0,
      errors,
      warnings
    };
  }
  
  /**
   * Import data from CSV file
   * @param {string} filePath - Path to the CSV file
   * @param {Object} options - Import options
   * @returns {Promise<Object>} - Import results
   */
  async importCSV(filePath, options) {
    const { entity, mappings, hasHeaderRow = true } = options;
    
    try {
      // Get entity configuration
      const entityConfig = this.getEntityConfig(entity);
      
      if (!entityConfig) {
        throw new AppError(`Unsupported entity: ${entity}`, 400);
      }
      
      // Validate field mappings
      const mappingValidation = this.validateFieldMappings(mappings, entity);
      
      if (!mappingValidation.valid) {
        throw new AppError(`Invalid field mappings: ${mappingValidation.errors.join(', ')}`, 400);
      }
      
      // Process CSV file
      const importResults = await csvService.processCSVForImport(filePath, {
        entity,
        mappings,
        schema: {
          requiredFields: entityConfig.requiredFields,
          uniqueFields: entityConfig.uniqueFields,
          validations: entityConfig.validations
        },
        dataTypes: entityConfig.dataTypes,
        hasHeaderRow
      });
      
      // Import valid records to database
      const model = entityConfig.model;
      const createdRecords = [];
      const errors = [...importResults.invalid];
      
      if (importResults.valid.length > 0) {
        // Start transaction
        const transaction = await db.sequelize.transaction();
        
        try {
          // Check for foreign key constraints
          if (entityConfig.foreignKeys) {
            for (const record of importResults.valid) {
              for (const [field, config] of Object.entries(entityConfig.foreignKeys)) {
                if (record[field]) {
                  // Check if the referenced record exists
                  const referencedModel = db[config.model];
                  const exists = await referencedModel.findOne({
                    where: { [config.field]: record[field] },
                    transaction
                  });
                  
                  if (!exists) {
                    errors.push({
                      original: record,
                      errors: [`Foreign key constraint failed: ${field} references ${config.model} but no record found with ID ${record[field]}`]
                    });
                    continue;
                  }
                }
              }
            }
          }
          
          // Filter out records with foreign key errors
          const validRecords = importResults.valid.filter(record => {
            return !errors.some(error => error.original === record);
          });
          
          // Bulk create records
          if (validRecords.length > 0) {
            const created = await model.bulkCreate(validRecords, {
              transaction,
              returning: true
            });
            
            createdRecords.push(...created);
          }
          
          // Commit transaction
          await transaction.commit();
        } catch (error) {
          // Rollback transaction
          await transaction.rollback();
          throw error;
        }
      }
      
      // Return results
      return {
        total: importResults.total,
        valid: importResults.valid.length,
        invalid: errors.length,
        created: createdRecords.length,
        errors
      };
    } catch (error) {
      if (error instanceof AppError) {
        throw error;
      }
      throw new AppError(`Failed to import CSV data: ${error.message}`, 500);
    } finally {
      // Clean up temporary file
      try {
        await fs.unlink(filePath);
      } catch (error) {
        console.error(`Failed to delete temporary file: ${error.message}`);
      }
    }
  }
  
  /**
   * Get all supported entities for import
   * @returns {Array} - List of supported entities
   */
  getSupportedEntities() {
    return [
      {
        name: 'patients',
        label: 'Patients',
        description: 'Patient demographic and medical information'
      },
      {
        name: 'facilities',
        label: 'Facilities',
        description: 'Healthcare facilities information'
      },
      {
        name: 'birth_statistics',
        label: 'Birth Statistics',
        description: 'Birth records and statistics'
      },
      {
        name: 'death_statistics',
        label: 'Death Statistics',
        description: 'Death records and statistics'
      },
      {
        name: 'immunizations',
        label: 'Immunizations',
        description: 'Vaccination and immunization records'
      },
      {
        name: 'antenatal_care',
        label: 'Antenatal Care',
        description: 'Antenatal care and pregnancy records'
      },
      {
        name: 'disease_cases',
        label: 'Disease Cases',
        description: 'Communicable disease case records'
      },
      {
        name: 'family_planning_clients',
        label: 'Family Planning Clients',
        description: 'Family planning client records'
      }
    ];
  }
  
  /**
   * Get entity schema for mapping
   * @param {string} entity - Entity name
   * @returns {Object} - Entity schema
   */
  getEntitySchema(entity) {
    const config = this.getEntityConfig(entity);
    
    if (!config) {
      throw new AppError(`Unsupported entity: ${entity}`, 400);
    }
    
    const fields = [];
    
    // Add fields with metadata
    for (const [field, dataType] of Object.entries(config.dataTypes)) {
      const isRequired = config.requiredFields.includes(field);
      const isUnique = config.uniqueFields.includes(field);
      const validation = config.validations[field] || {};
      
      fields.push({
        name: field,
        label: field.split('_').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' '),
        dataType,
        isRequired,
        isUnique,
        validation
      });
    }
    
    return {
      entity,
      fields,
      requiredFields: config.requiredFields,
      uniqueFields: config.uniqueFields
    };
  }
}

module.exports = new DataImportService();