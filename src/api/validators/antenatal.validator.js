// src/api/validators/antenatal.validator.js

const Joi = require('joi');

const bloodGroups = ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-', 'Unknown'];
const rhesusOptions = ['Positive', 'Negative', 'Unknown'];
const testResultOptions = ['Positive', 'Negative', 'Unknown', 'Not Tested'];
const outcomeOptions = ['Ongoing', 'Live Birth', 'Stillbirth', 'Miscarriage', 'Abortion', 'Ectopic Pregnancy', 'Unknown'];
const deliveryModes = ['Vaginal Delivery', 'Cesarean Section', 'Instrumental Delivery', 'Not Applicable', 'Unknown'];
const statusOptions = ['Active', 'Completed', 'Transferred', 'Lost to Follow-up'];

const fetalMovementOptions = ['Present', 'Absent', 'Not Checked'];
const presentationOptions = ['Cephalic', 'Breech', 'Transverse', 'Oblique', 'Not Determined'];

// Partner schema for nested validation
const partnerSchema = Joi.object({
  fullName: Joi.string().allow(null, ''),
  phoneNumber: Joi.string().allow(null, ''),
  bloodGroup: Joi.string().valid(...bloodGroups).default('Unknown'),
  hivStatus: Joi.string().valid(...testResultOptions).default('Not Tested'),
  sickling: Joi.string().valid(...testResultOptions).default('Not Tested'),
}).allow(null);

// Birth outcome schema for nested validation
const birthOutcomeSchema = Joi.object({
  birthWeight: Joi.number().allow(null),
  gender: Joi.string().valid('Male', 'Female', 'Unknown').allow(null),
  apgarScore: Joi.string().allow(null, ''),
  complications: Joi.array().items(Joi.string()).allow(null),
  notes: Joi.string().allow(null, ''),
}).allow(null);

const createAntenatalCareSchema = Joi.object({
  patientId: Joi.string().uuid().required().messages({
    'string.uuid': 'Patient ID must be a valid UUID',
    'any.required': 'Patient ID is required',
  }),
  facilityId: Joi.string().uuid().required().messages({
    'string.uuid': 'Facility ID must be a valid UUID',
    'any.required': 'Facility ID is required',
  }),
  registrationDate: Joi.date().iso().required().messages({
    'date.base': 'Registration date must be a valid date',
    'any.required': 'Registration date is required',
  }),
  lmp: Joi.date().iso().required().messages({
    'date.base': 'Last menstrual period must be a valid date',
    'any.required': 'Last menstrual period is required',
  }),
  edd: Joi.date().iso().required().messages({
    'date.base': 'Expected delivery date must be a valid date',
    'any.required': 'Expected delivery date is required',
  }),
  gravida: Joi.number().integer().min(1).required().messages({
    'number.base': 'Gravida must be a number',
    'number.integer': 'Gravida must be an integer',
    'number.min': 'Gravida must be at least 1',
    'any.required': 'Gravida is required',
  }),
  para: Joi.number().integer().min(0).required().messages({
    'number.base': 'Para must be a number',
    'number.integer': 'Para must be an integer',
    'number.min': 'Para must be at least 0',
    'any.required': 'Para is required',
  }),
  bloodGroup: Joi.string().valid(...bloodGroups).default('Unknown'),
  rhesus: Joi.string().valid(...rhesusOptions).default('Unknown'),
  height: Joi.number().allow(null),
  prePregnancyWeight: Joi.number().allow(null),
  hivStatus: Joi.string().valid(...testResultOptions).default('Not Tested'),
  sickling: Joi.string().valid(...testResultOptions).default('Not Tested'),
  hepatitisB: Joi.string().valid(...testResultOptions).default('Not Tested'),
  hepatitisC: Joi.string().valid(...testResultOptions).default('Not Tested'),
  vdrl: Joi.string().valid(...testResultOptions).default('Not Tested'),
  partner: partnerSchema,
  medicalHistory: Joi.string().allow(null, ''),
  obstetricsHistory: Joi.string().allow(null, ''),
  riskFactors: Joi.array().items(Joi.string()).allow(null),
  outcome: Joi.string().valid(...outcomeOptions).default('Ongoing'),
  deliveryDate: Joi.date().iso().allow(null).messages({
    'date.base': 'Delivery date must be a valid date',
  }),
  modeOfDelivery: Joi.string().valid(...deliveryModes).default('Not Applicable'),
  birthOutcome: birthOutcomeSchema,
  status: Joi.string().valid(...statusOptions).default('Active'),
});

const updateAntenatalCareSchema = Joi.object({
  lmp: Joi.date().iso().messages({
    'date.base': 'Last menstrual period must be a valid date',
  }),
  edd: Joi.date().iso().messages({
    'date.base': 'Expected delivery date must be a valid date',
  }),
  gravida: Joi.number().integer().min(1).messages({
    'number.base': 'Gravida must be a number',
    'number.integer': 'Gravida must be an integer',
    'number.min': 'Gravida must be at least 1',
  }),
  para: Joi.number().integer().min(0).messages({
    'number.base': 'Para must be a number',
    'number.integer': 'Para must be an integer',
    'number.min': 'Para must be at least 0',
  }),
  bloodGroup: Joi.string().valid(...bloodGroups),
  rhesus: Joi.string().valid(...rhesusOptions),
  height: Joi.number().allow(null),
  prePregnancyWeight: Joi.number().allow(null),
  hivStatus: Joi.string().valid(...testResultOptions),
  sickling: Joi.string().valid(...testResultOptions),
  hepatitisB: Joi.string().valid(...testResultOptions),
  hepatitisC: Joi.string().valid(...testResultOptions),
  vdrl: Joi.string().valid(...testResultOptions),
  partner: partnerSchema,
  medicalHistory: Joi.string().allow(null, ''),
  obstetricsHistory: Joi.string().allow(null, ''),
  riskFactors: Joi.array().items(Joi.string()).allow(null),
  outcome: Joi.string().valid(...outcomeOptions),
  deliveryDate: Joi.date().iso().allow(null).messages({
    'date.base': 'Delivery date must be a valid date',
  }),
  modeOfDelivery: Joi.string().valid(...deliveryModes),
  birthOutcome: birthOutcomeSchema,
  status: Joi.string().valid(...statusOptions),
});

const searchAntenatalCareSchema = Joi.object({
  patientId: Joi.string().uuid().messages({
    'string.uuid': 'Patient ID must be a valid UUID',
  }),
  facilityId: Joi.string().uuid().messages({
    'string.uuid': 'Facility ID must be a valid UUID',
  }),
  registrationDateFrom: Joi.date().iso().messages({
    'date.base': 'Registration from date must be a valid date',
  }),
  registrationDateTo: Joi.date().iso().min(Joi.ref('registrationDateFrom')).messages({
    'date.base': 'Registration to date must be a valid date',
    'date.min': 'Registration to date must be greater than or equal to from date',
  }),
  eddFrom: Joi.date().iso().messages({
    'date.base': 'EDD from date must be a valid date',
  }),
  eddTo: Joi.date().iso().min(Joi.ref('eddFrom')).messages({
    'date.base': 'EDD to date must be a valid date',
    'date.min': 'EDD to date must be greater than or equal to from date',
  }),
  status: Joi.string().valid(...statusOptions),
  outcome: Joi.string().valid(...outcomeOptions),
  hivStatus: Joi.string().valid(...testResultOptions),
  page: Joi.number().integer().min(1).default(1),
  limit: Joi.number().integer().min(1).max(100).default(10),
  sortBy: Joi.string().valid('registrationDate', 'edd', 'createdAt').default('registrationDate'),
  sortOrder: Joi.string().valid('asc', 'desc').default('desc'),
});

const createAntenatalVisitSchema = Joi.object({
  antenatalCareId: Joi.string().uuid().required().messages({
    'string.uuid': 'Antenatal Care ID must be a valid UUID',
    'any.required': 'Antenatal Care ID is required',
  }),
  visitDate: Joi.date().iso().required().messages({
    'date.base': 'Visit date must be a valid date',
    'any.required': 'Visit date is required',
  }),
  gestationalAge: Joi.number().integer().min(1).max(45).required().messages({
    'number.base': 'Gestational age must be a number',
    'number.integer': 'Gestational age must be an integer',
    'number.min': 'Gestational age must be at least 1',
    'number.max': 'Gestational age cannot exceed 45',
    'any.required': 'Gestational age is required',
  }),
  weight: Joi.number().required().messages({
    'number.base': 'Weight must be a number',
    'any.required': 'Weight is required',
  }),
  bloodPressure: Joi.string().pattern(/^\d{1,3}\/\d{1,3}$/).required().messages({
    'string.pattern.base': 'Blood pressure must be in the format of systolic/diastolic (e.g., 120/80)',
    'any.required': 'Blood pressure is required',
  }),
  fetalHeartRate: Joi.number().integer().min(60).max(220).allow(null).messages({
    'number.base': 'Fetal heart rate must be a number',
    'number.integer': 'Fetal heart rate must be an integer',
    'number.min': 'Fetal heart rate must be at least 60',
    'number.max': 'Fetal heart rate cannot exceed 220',
  }),
  fetalMovement: Joi.string().valid(...fetalMovementOptions).default('Not Checked'),
  fundusHeight: Joi.number().allow(null),
  presentation: Joi.string().valid(...presentationOptions).default('Not Determined'),
  urineProtein: Joi.string().allow(null, ''),
  urineGlucose: Joi.string().allow(null, ''),
  hemoglobin: Joi.number().allow(null),
  complaints: Joi.string().allow(null, ''),
  diagnosis: Joi.string().allow(null, ''),
  treatment: Joi.string().allow(null, ''),
  notes: Joi.string().allow(null, ''),
  nextAppointment: Joi.date().iso().allow(null).messages({
    'date.base': 'Next appointment date must be a valid date',
  }),
});

const updateAntenatalVisitSchema = Joi.object({
  visitDate: Joi.date().iso().messages({
    'date.base': 'Visit date must be a valid date',
  }),
  gestationalAge: Joi.number().integer().min(1).max(45).messages({
    'number.base': 'Gestational age must be a number',
    'number.integer': 'Gestational age must be an integer',
    'number.min': 'Gestational age must be at least 1',
    'number.max': 'Gestational age cannot exceed 45',
  }),
  weight: Joi.number().messages({
    'number.base': 'Weight must be a number',
  }),
  bloodPressure: Joi.string().pattern(/^\d{1,3}\/\d{1,3}$/).messages({
    'string.pattern.base': 'Blood pressure must be in the format of systolic/diastolic (e.g., 120/80)',
  }),
  fetalHeartRate: Joi.number().integer().min(60).max(220).allow(null).messages({
    'number.base': 'Fetal heart rate must be a number',
    'number.integer': 'Fetal heart rate must be an integer',
    'number.min': 'Fetal heart rate must be at least 60',
    'number.max': 'Fetal heart rate cannot exceed 220',
  }),
  fetalMovement: Joi.string().valid(...fetalMovementOptions),
  fundusHeight: Joi.number().allow(null),
  presentation: Joi.string().valid(...presentationOptions),
  urineProtein: Joi.string().allow(null, ''),
  urineGlucose: Joi.string().allow(null, ''),
  hemoglobin: Joi.number().allow(null),
  complaints: Joi.string().allow(null, ''),
  diagnosis: Joi.string().allow(null, ''),
  treatment: Joi.string().allow(null, ''),
  notes: Joi.string().allow(null, ''),
  nextAppointment: Joi.date().iso().allow(null).messages({
    'date.base': 'Next appointment date must be a valid date',
  }),
});

const searchAntenatalVisitSchema = Joi.object({
  antenatalCareId: Joi.string().uuid().messages({
    'string.uuid': 'Antenatal Care ID must be a valid UUID',
  }),
  patientId: Joi.string().uuid().messages({
    'string.uuid': 'Patient ID must be a valid UUID',
  }),
  visitDateFrom: Joi.date().iso().messages({
    'date.base': 'Visit from date must be a valid date',
  }),
  visitDateTo: Joi.date().iso().min(Joi.ref('visitDateFrom')).messages({
    'date.base': 'Visit to date must be a valid date',
    'date.min': 'Visit to date must be greater than or equal to from date',
  }),
  minGestationalAge: Joi.number().integer().min(1).messages({
    'number.base': 'Minimum gestational age must be a number',
    'number.integer': 'Minimum gestational age must be an integer',
    'number.min': 'Minimum gestational age must be at least 1',
  }),
  maxGestationalAge: Joi.number().integer().max(45).min(Joi.ref('minGestationalAge')).messages({
    'number.base': 'Maximum gestational age must be a number',
    'number.integer': 'Maximum gestational age must be an integer',
    'number.max': 'Maximum gestational age cannot exceed 45',
    'number.min': 'Maximum gestational age must be greater than or equal to minimum gestational age',
  }),
  page: Joi.number().integer().min(1).default(1),
  limit: Joi.number().integer().min(1).max(100).default(10),
  sortBy: Joi.string().valid('visitDate', 'gestationalAge', 'createdAt').default('visitDate'),
  sortOrder: Joi.string().valid('asc', 'desc').default('desc'),
});

module.exports = {
  createAntenatalCareSchema,
  updateAntenatalCareSchema,
  searchAntenatalCareSchema,
  createAntenatalVisitSchema,
  updateAntenatalVisitSchema,
  searchAntenatalVisitSchema,
};