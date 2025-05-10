// src/models/antenatal.model.js

module.exports = (sequelize, DataTypes) => {
    const AntenatalCare = sequelize.define('AntenatalCare', {
      id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
      },
      patientId: {
        type: DataTypes.UUID,
        allowNull: false,
        references: {
          model: 'Patients',
          key: 'id',
        },
      },
      facilityId: {
        type: DataTypes.UUID,
        allowNull: false,
        references: {
          model: 'Facilities',
          key: 'id',
        },
      },
      registrationDate: {
        type: DataTypes.DATE,
        allowNull: false,
      },
      lmp: { // Last Menstrual Period
        type: DataTypes.DATE,
        allowNull: false,
      },
      edd: { // Expected Delivery Date
        type: DataTypes.DATE,
        allowNull: false,
      },
      gravida: { // Number of pregnancies
        type: DataTypes.INTEGER,
        allowNull: false,
        validate: {
          min: 1,
        },
      },
      para: { // Number of births
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 0,
      },
      bloodGroup: {
        type: DataTypes.ENUM('A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-', 'Unknown'),
        allowNull: false,
        defaultValue: 'Unknown',
      },
      rhesus: {
        type: DataTypes.ENUM('Positive', 'Negative', 'Unknown'),
        allowNull: false,
        defaultValue: 'Unknown',
      },
      height: { // in cm
        type: DataTypes.FLOAT,
        allowNull: true,
      },
      prePregnancyWeight: { // in kg
        type: DataTypes.FLOAT,
        allowNull: true,
      },
      hivStatus: {
        type: DataTypes.ENUM('Positive', 'Negative', 'Unknown', 'Not Tested'),
        allowNull: false,
        defaultValue: 'Not Tested',
      },
      sickling: {
        type: DataTypes.ENUM('Positive', 'Negative', 'Unknown', 'Not Tested'),
        allowNull: false,
        defaultValue: 'Not Tested',
      },
      hepatitisB: {
        type: DataTypes.ENUM('Positive', 'Negative', 'Unknown', 'Not Tested'),
        allowNull: false,
        defaultValue: 'Not Tested',
      },
      hepatitisC: {
        type: DataTypes.ENUM('Positive', 'Negative', 'Unknown', 'Not Tested'),
        allowNull: false,
        defaultValue: 'Not Tested',
      },
      vdrl: { // Venereal Disease Research Laboratory test
        type: DataTypes.ENUM('Positive', 'Negative', 'Unknown', 'Not Tested'),
        allowNull: false,
        defaultValue: 'Not Tested',
      },
      partner: {
        type: DataTypes.JSON,
        allowNull: true,
        defaultValue: {},
      },
      medicalHistory: {
        type: DataTypes.TEXT,
        allowNull: true,
      },
      obstetricsHistory: {
        type: DataTypes.TEXT,
        allowNull: true,
      },
      riskFactors: {
        type: DataTypes.ARRAY(DataTypes.STRING),
        allowNull: true,
        defaultValue: [],
      },
      outcome: {
        type: DataTypes.ENUM(
          'Ongoing', 
          'Live Birth', 
          'Stillbirth', 
          'Miscarriage', 
          'Abortion',
          'Ectopic Pregnancy',
          'Unknown'
        ),
        allowNull: false,
        defaultValue: 'Ongoing',
      },
      deliveryDate: {
        type: DataTypes.DATE,
        allowNull: true,
      },
      modeOfDelivery: {
        type: DataTypes.ENUM(
          'Vaginal Delivery', 
          'Cesarean Section', 
          'Instrumental Delivery',
          'Not Applicable',
          'Unknown'
        ),
        allowNull: false,
        defaultValue: 'Not Applicable',
      },
      birthOutcome: {
        type: DataTypes.JSON,
        allowNull: true,
        defaultValue: {},
        // Structure: {
        //   birthWeight: Float,
        //   gender: String,
        //   apgarScore: String,
        //   complications: Array,
        //   notes: String
        // }
      },
      status: {
        type: DataTypes.ENUM('Active', 'Completed', 'Transferred', 'Lost to Follow-up'),
        allowNull: false,
        defaultValue: 'Active',
      },
      createdBy: {
        type: DataTypes.UUID,
        allowNull: false,
        references: {
          model: 'Users',
          key: 'id',
        },
      },
      updatedBy: {
        type: DataTypes.UUID,
        allowNull: true,
        references: {
          model: 'Users',
          key: 'id',
        },
      },
    }, {
      tableName: 'antenatal_care',
      timestamps: true,
      paranoid: true, // This enables soft delete
    });
  
    // Create AntenatalVisit model
    const AntenatalVisit = sequelize.define('AntenatalVisit', {
      id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
      },
      antenatalCareId: {
        type: DataTypes.UUID,
        allowNull: false,
        references: {
          model: 'antenatal_care',
          key: 'id',
        },
      },
      visitDate: {
        type: DataTypes.DATE,
        allowNull: false,
      },
      gestationalAge: { // in weeks
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      weight: { // in kg
        type: DataTypes.FLOAT,
        allowNull: false,
      },
      bloodPressure: {
        type: DataTypes.STRING, // Format: "systolic/diastolic", e.g., "120/80"
        allowNull: false,
      },
      fetalHeartRate: { // beats per minute
        type: DataTypes.INTEGER,
        allowNull: true,
      },
      fetalMovement: {
        type: DataTypes.ENUM('Present', 'Absent', 'Not Checked'),
        allowNull: false,
        defaultValue: 'Not Checked',
      },
      fundusHeight: { // in cm
        type: DataTypes.FLOAT,
        allowNull: true,
      },
      presentation: {
        type: DataTypes.ENUM('Cephalic', 'Breech', 'Transverse', 'Oblique', 'Not Determined'),
        allowNull: false,
        defaultValue: 'Not Determined',
      },
      urineProtein: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      urineGlucose: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      hemoglobin: { // g/dL
        type: DataTypes.FLOAT,
        allowNull: true,
      },
      complaints: {
        type: DataTypes.TEXT,
        allowNull: true,
      },
      diagnosis: {
        type: DataTypes.TEXT,
        allowNull: true,
      },
      treatment: {
        type: DataTypes.TEXT,
        allowNull: true,
      },
      notes: {
        type: DataTypes.TEXT,
        allowNull: true,
      },
      nextAppointment: {
        type: DataTypes.DATE,
        allowNull: true,
      },
      createdBy: {
        type: DataTypes.UUID,
        allowNull: false,
        references: {
          model: 'Users',
          key: 'id',
        },
      },
      updatedBy: {
        type: DataTypes.UUID,
        allowNull: true,
        references: {
          model: 'Users',
          key: 'id',
        },
      },
    }, {
      tableName: 'antenatal_visits',
      timestamps: true,
      paranoid: true, // This enables soft delete
    });
  
    AntenatalCare.associate = (models) => {
      AntenatalCare.belongsTo(models.Patient, {
        foreignKey: 'patientId',
        as: 'patient',
      });
      AntenatalCare.belongsTo(models.Facility, {
        foreignKey: 'facilityId',
        as: 'facility',
      });
      AntenatalCare.belongsTo(models.User, {
        foreignKey: 'createdBy',
        as: 'creator',
      });
      AntenatalCare.belongsTo(models.User, {
        foreignKey: 'updatedBy',
        as: 'updater',
      });
      AntenatalCare.hasMany(models.AntenatalVisit, {
        foreignKey: 'antenatalCareId',
        as: 'visits',
      });
    };
  
    AntenatalVisit.associate = (models) => {
      AntenatalVisit.belongsTo(models.AntenatalCare, {
        foreignKey: 'antenatalCareId',
        as: 'antenatalCare',
      });
      AntenatalVisit.belongsTo(models.User, {
        foreignKey: 'createdBy',
        as: 'creator',
      });
      AntenatalVisit.belongsTo(models.User, {
        foreignKey: 'updatedBy',
        as: 'updater',
      });
    };
  
    return { AntenatalCare, AntenatalVisit };
  };