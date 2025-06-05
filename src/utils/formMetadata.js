const lgaOptions = [
    'Abak', 'Eastern Obolo', 'Eket', 'Esit Eket', 'Essien Udim', 
    'Etim Ekpo', 'Etinan', 'Ibeno', 'Ibesikpo Asutan', 'Ibiono-Ibom', 
    'Ika', 'Ikono', 'Ikot Abasi', 'Ikot Ekpene', 'Ini', 'Itu', 'Mbo', 
    'Mkpat-Enin', 'Nsit-Atai', 'Nsit-Ibom', 'Nsit-Ubium', 'Obot Akara', 
    'Okobo', 'Onna', 'Oron', 'Oruk Anam', 'Udung-Uko', 'Ukanafun', 
    'Uruan', 'Urue-Offong/Oruko', 'Uyo', 'Other'
  ].map(lga => ({ value: lga, label: lga }));
  
  const getBirthFormMetadata = () => {
    return {
      // Maternal Data
      motherId: {
        type: 'uuid',
        required: true,
        label: 'Mother ID'
      },
      motherName: {
        type: 'text',
        required: true,
        maxLength: 100,
        label: 'Mother Name'
      },
      motherAge: {
        type: 'number',
        required: true,
        min: 0,
        max: 120,
        label: 'Mother Age'
      },
      motherLgaOrigin: {
        type: 'select',
        required: true,
        options: lgaOptions,
        label: 'Mother LGA of Origin'
      },
      motherLgaResidence: {
        type: 'select',
        required: true,
        options: lgaOptions,
        label: 'Mother LGA of Residence'
      },
      motherParity: {
        type: 'number',
        required: true,
        min: 0,
        label: 'Mother Parity'
      },
  
      // Birth Data
      birthDate: {
        type: 'date',
        required: true,
        label: 'Birth Date'
      },
      birthTime: {
        type: 'time',
        required: true,
        label: 'Birth Time'
      },
      gender: {
        type: 'select',
        required: true,
        options: [
          { value: 'male', label: 'Male' },
          { value: 'female', label: 'Female' },
          { value: 'other', label: 'Other' }
        ],
        label: 'Gender'
      },
      placeOfBirth: {
        type: 'select',
        required: true,
        options: [
          { value: 'HOSPITAL', label: 'Hospital' },
          { value: 'HOME', label: 'Home' }
        ],
        default: 'HOSPITAL',
        label: 'Place of Birth'
      },
      birthType: {
        type: 'select',
        required: true,
        options: [
          { value: 'singleton', label: 'Single Birth' },
          { value: 'twin', label: 'Twin' },
          { value: 'triplet', label: 'Triplet' },
          { value: 'quadruplet', label: 'Quadruplet' },
          { value: 'other', label: 'Other Multiple' }
        ],
        label: 'Birth Type'
      },
      deliveryMethod: {
        type: 'select',
        required: true,
        options: [
          { value: 'vaginal', label: 'Vaginal Delivery' },
          { value: 'cesarean', label: 'Cesarean Section' },
          { value: 'assisted', label: 'Assisted Delivery' },
          { value: 'other', label: 'Other' }
        ],
        label: 'Delivery Method'
      },
      facilityId: {
        type: 'uuid',
        required: true,
        label: 'Facility ID'
      },
  
      // Optional Fields
      fatherName: {
        type: 'text',
        required: false,
        maxLength: 100,
        label: 'Father Name'
      },
      fatherAge: {
        type: 'number',
        required: false,
        min: 0,
        max: 120,
        label: 'Father Age'
      },
      birthWeight: {
        type: 'number',
        required: false,
        min: 0,
        step: 0.1,
        label: 'Birth Weight (kg)'
      },
      apgarScoreOneMin: {
        type: 'number',
        required: false,
        min: 0,
        max: 10,
        label: 'APGAR Score (1 min)'
      },
      apgarScoreFiveMin: {
        type: 'number',
        required: false,
        min: 0,
        max: 10,
        label: 'APGAR Score (5 min)'
      }
    };
  };
  
  module.exports = {
    getBirthFormMetadata
  };