module.exports = {
    // User roles
    ROLES: {
      ADMIN: 'admin',
      HEALTH_COMMISSIONER: 'health_commissioner',
      FACILITY_ADMIN: 'facility_admin',
      DOCTOR: 'doctor',
      NURSE: 'nurse',
      DATA_ENTRY: 'data_entry',
    },
    
    // User status
    USER_STATUS: {
      ACTIVE: 'active',
      INACTIVE: 'inactive',
      PENDING: 'pending',
    },
    
    // Facility types
    FACILITY_TYPES: {
      HOSPITAL: 'hospital',
      CLINIC: 'clinic',
      HEALTH_CENTER: 'health_center',
      MATERNITY: 'maternity',
    },
    
    // Health areas
    HEALTH_AREAS: {
      BIRTH: 'birth',
      DEATH: 'death',
      IMMUNIZATION: 'immunization',
      ANTENATAL: 'antenatal',
      COMMUNICABLE_DISEASE: 'communicable_disease',
      FAMILY_PLANNING: 'family_planning',
    },
    
    // Immunization types
    IMMUNIZATION_TYPES: {
      ROUTINE: 'routine',
      SPECIAL: 'special',
      CAMPAIGN: 'campaign',
    },
    
    // Nigerian states and LGAs
    STATES: {
      AKWA_IBOM: 'Akwa Ibom',
      // Add other states as needed
    },
    
    // Akwa Ibom LGAs
    AKWA_IBOM_LGAS: [
      'Abak',
      'Eastern Obolo',
      'Eket',
      'Esit Eket',
      'Essien Udim',
      'Etim Ekpo',
      'Etinan',
      'Ibeno',
      'Ibesikpo Asutan',
      'Ibiono-Ibom',
      'Ika',
      'Ikono',
      'Ikot Abasi',
      'Ikot Ekpene',
      'Ini',
      'Itu',
      'Mbo',
      'Mkpat-Enin',
      'Nsit-Atai',
      'Nsit-Ibom',
      'Nsit-Ubium',
      'Obot Akara',
      'Okobo',
      'Onna',
      'Oron',
      'Oruk Anam',
      'Udung-Uko',
      'Ukanafun',
      'Uruan',
      'Urue-Offong/Oruko',
      'Uyo',
    ],
    
    // Contraception methods
    CONTRACEPTION_METHODS: [
      'Condoms',
      'Oral Contraceptives',
      'Injectable',
      'Implants',
      'IUD',
      'Natural Family Planning',
      'Sterilization',
      'None',
    ],
    
    // Common HTTP status codes
    HTTP_STATUS: {
      OK: 200,
      CREATED: 201,
      NO_CONTENT: 204,
      BAD_REQUEST: 400,
      UNAUTHORIZED: 401,
      FORBIDDEN: 403,
      NOT_FOUND: 404,
      CONFLICT: 409,
      UNPROCESSABLE_ENTITY: 422,
      INTERNAL_SERVER_ERROR: 500,
    },
  };