// src/api/validators/disease.validator.js

const Joi = require('joi');

// DiseaseRegistry validation schemas
const createDiseaseRegistrySchema = Joi.object({
  name: Joi.string().required().messages({
    'string.empty': 'Disease name cannot be empty',
    'any.required': 'Disease name is required',
  }),
  description: Joi.string().allow(null, ''),
  icdCode: Joi.string().allow(null, ''),
  symptoms: Joi.array().items(Joi.string()).allow(null),
  transmissionRoutes: Joi.array().items(Joi.string()).allow(null),
  preventiveMeasures: Joi.array().items(Joi.string()).allow(null),
  treatmentGuidelines: Joi.string().allow(null, ''),
  notifiable: Joi.boolean().default(true),
  incubationPeriodMin: Joi.number().integer().min(0).allow(null),
  incubationPeriodMax: Joi.number().integer().min(Joi.ref('incubationPeriodMin')).allow(null),
  isActive: Joi.boolean().default(true),
});

const updateDiseaseRegistrySchema = Joi.object({
  name: Joi.string().messages({
    'string.empty': 'Disease name cannot be empty',
  }),
  description: Joi.string().allow(null, ''),
  icdCode: Joi.string().allow(null, ''),
  symptoms: Joi.array().items(Joi.string()).allow(null),
  transmissionRoutes: Joi.array().items(Joi.string()).allow(null),
  preventiveMeasures: Joi.array().items(Joi.string()).allow(null),
  treatmentGuidelines: Joi.string().allow(null, ''),
  notifiable: Joi.boolean(),
  incubationPeriodMin: Joi.number().integer().min(0).allow(null),
  incubationPeriodMax: Joi.number().integer().min(Joi.ref('incubationPeriodMin')).allow(null),
  isActive: Joi.boolean(),
});

const searchDiseaseRegistrySchema = Joi.object({
  name: Joi.string(),
  notifiable: Joi.boolean(),
  isActive: Joi.boolean(),
  page: Joi.number().integer().min(1).default(1),
  limit: Joi.number().integer().min(1).max(100).default(10),
  sortBy: Joi.string().valid('name', 'createdAt').default('name'),
  sortOrder: Joi.string().valid('asc', 'desc').default('asc'),
});

// DiseaseCase validation schemas
const diagnosisTypes = ['Clinical', 'Laboratory', 'Epidemiological', 'Presumptive'];
const severityLevels = ['Mild', 'Moderate', 'Severe', 'Critical'];
const outcomeOptions = ['Recovered', 'Recovering', 'Deceased', 'Unknown', 'Lost to Follow-up'];
const statusOptions = ['Active', 'Resolved', 'Deceased', 'Lost to Follow-up'];

const createDiseaseCaseSchema = Joi.object({
  diseaseId: Joi.string().uuid().required().messages({
    'string.uuid': 'Disease ID must be a valid UUID',
    'any.required': 'Disease ID is required',
  }),
  patientId: Joi.string().uuid().required().messages({
    'string.uuid': 'Patient ID must be a valid UUID',
    'any.required': 'Patient ID is required',
  }),
  facilityId: Joi.string().uuid().required().messages({
    'string.uuid': 'Facility ID must be a valid UUID',
    'any.required': 'Facility ID is required',
  }),
  reportingDate: Joi.date().iso().required().messages({
    'date.base': 'Reporting date must be a valid date',
    'any.required': 'Reporting date is required',
  }),
  onsetDate: Joi.date().iso().allow(null).messages({
    'date.base': 'Onset date must be a valid date',
  }),
  diagnosisDate: Joi.date().iso().required().messages({
    'date.base': 'Diagnosis date must be a valid date',
    'any.required': 'Diagnosis date is required',
  }),
  diagnosisType: Joi.string().valid(...diagnosisTypes).required().messages({
    'any.only': `Diagnosis type must be one of: ${diagnosisTypes.join(', ')}`,
    'any.required': 'Diagnosis type is required',
  }),
  symptoms: Joi.array().items(Joi.string()).allow(null),
  labTestResults: Joi.object().allow(null),
  severity: Joi.string().valid(...severityLevels).required().messages({
    'any.only': `Severity must be one of: ${severityLevels.join(', ')}`,
    'any.required': 'Severity is required',
  }),
  hospitalized: Joi.boolean().default(false),
  hospitalizationDate: Joi.date().iso().allow(null).messages({
    'date.base': 'Hospitalization date must be a valid date',
  }),
  dischargeDate: Joi.date().iso().min(Joi.ref('hospitalizationDate')).allow(null).messages({
    'date.base': 'Discharge date must be a valid date',
    'date.min': 'Discharge date must be after hospitalization date',
  }),
  outcome: Joi.string().valid(...outcomeOptions).default('Unknown'),
  outcomeDate: Joi.date().iso().allow(null).messages({
    'date.base': 'Outcome date must be a valid date',
  }),
  transmissionRoute: Joi.string().allow(null, ''),
  transmissionLocation: Joi.string().allow(null, ''),
  travelHistory: Joi.string().allow(null, ''),
  contactHistory: Joi.string().allow(null, ''),
  treatmentProvided: Joi.string().allow(null, ''),
  complications: Joi.array().items(Joi.string()).allow(null),
  notes: Joi.string().allow(null, ''),
  reportedToAuthorities: Joi.boolean().default(false),
  reportedDate: Joi.date().iso().allow(null).messages({
    'date.base': 'Reported date must be a valid date',
  }),
  status: Joi.string().valid(...statusOptions).default('Active'),
});

const updateDiseaseCaseSchema = Joi.object({
  reportingDate: Joi.date().iso().messages({
    'date.base': 'Reporting date must be a valid date',
  }),
  onsetDate: Joi.date().iso().allow(null).messages({
    'date.base': 'Onset date must be a valid date',
  }),
  diagnosisDate: Joi.date().iso().messages({
    'date.base': 'Diagnosis date must be a valid date',
  }),
  diagnosisType: Joi.string().valid(...diagnosisTypes).messages({
    'any.only': `Diagnosis type must be one of: ${diagnosisTypes.join(', ')}`,
  }),
  symptoms: Joi.array().items(Joi.string()).allow(null),
  labTestResults: Joi.object().allow(null),
  severity: Joi.string().valid(...severityLevels).messages({
    'any.only': `Severity must be one of: ${severityLevels.join(', ')}`,
  }),
  hospitalized: Joi.boolean(),
  hospitalizationDate: Joi.date().iso().allow(null).messages({
    'date.base': 'Hospitalization date must be a valid date',
  }),
  dischargeDate: Joi.date().iso().min(Joi.ref('hospitalizationDate')).allow(null).messages({
    'date.base': 'Discharge date must be a valid date',
    'date.min': 'Discharge date must be after hospitalization date',
  }),
  outcome: Joi.string().valid(...outcomeOptions),
  outcomeDate: Joi.date().iso().allow(null).messages({
    'date.base': 'Outcome date must be a valid date',
  }),
  transmissionRoute: Joi.string().allow(null, ''),
  transmissionLocation: Joi.string().allow(null, ''),
  travelHistory: Joi.string().allow(null, ''),
  contactHistory: Joi.string().allow(null, ''),
  treatmentProvided: Joi.string().allow(null, ''),
  complications: Joi.array().items(Joi.string()).allow(null),
  notes: Joi.string().allow(null, ''),
  reportedToAuthorities: Joi.boolean(),
  reportedDate: Joi.date().iso().allow(null).messages({
    'date.base': 'Reported date must be a valid date',
  }),
  status: Joi.string().valid(...statusOptions),
});

const searchDiseaseCaseSchema = Joi.object({
  diseaseId: Joi.string().uuid().messages({
    'string.uuid': 'Disease ID must be a valid UUID',
  }),
  patientId: Joi.string().uuid().messages({
    'string.uuid': 'Patient ID must be a valid UUID',
  }),
  facilityId: Joi.string().uuid().messages({
    'string.uuid': 'Facility ID must be a valid UUID',
  }),
  reportingDateFrom: Joi.date().iso().messages({
    'date.base': 'Reporting from date must be a valid date',
  }),
  reportingDateTo: Joi.date().iso().min(Joi.ref('reportingDateFrom')).messages({
    'date.base': 'Reporting to date must be a valid date',
    'date.min': 'Reporting to date must be greater than or equal to from date',
  }),
  diagnosisType: Joi.string().valid(...diagnosisTypes),
  severity: Joi.string().valid(...severityLevels),
  hospitalized: Joi.boolean(),
  outcome: Joi.string().valid(...outcomeOptions),
  status: Joi.string().valid(...statusOptions),
  reportedToAuthorities: Joi.boolean(),
  page: Joi.number().integer().min(1).default(1),
  limit: Joi.number().integer().min(1).max(100).default(10),
  sortBy: Joi.string().valid('reportingDate', 'diagnosisDate', 'createdAt').default('reportingDate'),
  sortOrder: Joi.string().valid('asc', 'desc').default('desc'),
});

// ContactTracing validation schemas
const contactTypes = ['Household', 'Workplace', 'Healthcare', 'Social', 'Travel', 'Other'];
const riskLevels = ['High', 'Medium', 'Low', 'Unknown'];
const monitoringStatuses = ['Not Started', 'Ongoing', 'Completed', 'Lost to Follow-up'];
const testStatuses = ['Not Tested', 'Pending', 'Positive', 'Negative'];

const createContactTracingSchema = Joi.object({
  diseaseCaseId: Joi.string().uuid().required().messages({
    'string.uuid': 'Disease case ID must be a valid UUID',
    'any.required': 'Disease case ID is required',
  }),
  contactType: Joi.string().valid(...contactTypes).required().messages({
    'any.only': `Contact type must be one of: ${contactTypes.join(', ')}`,
    'any.required': 'Contact type is required',
  }),
  contactName: Joi.string().required().messages({
    'string.empty': 'Contact name cannot be empty',
    'any.required': 'Contact name is required',
  }),
  contactPhone: Joi.string().allow(null, ''),
  contactAddress: Joi.string().allow(null, ''),
  exposureDate: Joi.date().iso().allow(null).messages({
    'date.base': 'Exposure date must be a valid date',
  }),
  exposureDuration: Joi.number().integer().min(0).allow(null),
  exposureLocation: Joi.string().allow(null, ''),
  relationshipToPatient: Joi.string().allow(null, ''),
  riskAssessment: Joi.string().valid(...riskLevels).default('Unknown'),
  monitoringStatus: Joi.string().valid(...monitoringStatuses).default('Not Started'),
  symptomDevelopment: Joi.boolean().default(false),
  symptomOnsetDate: Joi.date().iso().allow(null).messages({
    'date.base': 'Symptom onset date must be a valid date',
  }),
  testedStatus: Joi.string().valid(...testStatuses).default('Not Tested'),
  testDate: Joi.date().iso().allow(null).messages({
    'date.base': 'Test date must be a valid date',
  }),
  notes: Joi.string().allow(null, ''),
  monitoringEndDate: Joi.date().iso().allow(null).messages({
    'date.base': 'Monitoring end date must be a valid date',
  }),
});

const updateContactTracingSchema = Joi.object({
  contactType: Joi.string().valid(...contactTypes).messages({
    'any.only': `Contact type must be one of: ${contactTypes.join(', ')}`,
  }),
  contactName: Joi.string().messages({
    'string.empty': 'Contact name cannot be empty',
  }),
  contactPhone: Joi.string().allow(null, ''),
  contactAddress: Joi.string().allow(null, ''),
  exposureDate: Joi.date().iso().allow(null).messages({
    'date.base': 'Exposure date must be a valid date',
  }),
  exposureDuration: Joi.number().integer().min(0).allow(null),
  exposureLocation: Joi.string().allow(null, ''),
  relationshipToPatient: Joi.string().allow(null, ''),
  riskAssessment: Joi.string().valid(...riskLevels),
  monitoringStatus: Joi.string().valid(...monitoringStatuses),
  symptomDevelopment: Joi.boolean(),
  symptomOnsetDate: Joi.date().iso().allow(null).messages({
    'date.base': 'Symptom onset date must be a valid date',
  }),
  testedStatus: Joi.string().valid(...testStatuses),
  testDate: Joi.date().iso().allow(null).messages({
    'date.base': 'Test date must be a valid date',
  }),
  notes: Joi.string().allow(null, ''),
  monitoringEndDate: Joi.date().iso().allow(null).messages({
    'date.base': 'Monitoring end date must be a valid date',
  }),
});

const searchContactTracingSchema = Joi.object({
  diseaseCaseId: Joi.string().uuid().messages({
    'string.uuid': 'Disease case ID must be a valid UUID',
  }),
  contactType: Joi.string().valid(...contactTypes),
  riskAssessment: Joi.string().valid(...riskLevels),
  monitoringStatus: Joi.string().valid(...monitoringStatuses),
  symptomDevelopment: Joi.boolean(),
  testedStatus: Joi.string().valid(...testStatuses),
  exposureDateFrom: Joi.date().iso().messages({
    'date.base': 'Exposure from date must be a valid date',
  }),
  exposureDateTo: Joi.date().iso().min(Joi.ref('exposureDateFrom')).messages({
    'date.base': 'Exposure to date must be a valid date',
    'date.min': 'Exposure to date must be greater than or equal to from date',
  }),
  page: Joi.number().integer().min(1).default(1),
  limit: Joi.number().integer().min(1).max(100).default(10),
  sortBy: Joi.string().valid('exposureDate', 'contactName', 'riskAssessment', 'createdAt').default('exposureDate'),
  sortOrder: Joi.string().valid('asc', 'desc').default('desc'),
});

module.exports = {
  createDiseaseRegistrySchema,
  updateDiseaseRegistrySchema,
  searchDiseaseRegistrySchema,
  createDiseaseCaseSchema,
  updateDiseaseCaseSchema,
  searchDiseaseCaseSchema,
  createContactTracingSchema,
  updateContactTracingSchema,
  searchContactTracingSchema,
};