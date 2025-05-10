// src/api/services/export.service.js

const path = require('path');
const fs = require('fs').promises;
const { writeCSV } = require('../../utils/csvParser');
const { generateTablePDF, generateReportPDF } = require('../../utils/pdfGenerator');
const ExcelJS = require('exceljs');
const db = require('../../models');
const { AppError } = require('../../utils/error');
const { Op } = require('sequelize');

// Helper function to create directory if it doesn't exist
const ensureDirectoryExists = async (dirPath) => {
  try {
    await fs.mkdir(dirPath, { recursive: true });
  } catch (error) {
    if (error.code !== 'EEXIST') {
      throw error;
    }
  }
};

class ExportService {
  constructor() {
    this.exportDir = path.join(__dirname, '../../../exports');
    ensureDirectoryExists(this.exportDir);
  }
  
  /**
   * Get export configuration for an entity
   * @param {string} entity - Entity name
   * @returns {Object} - Entity export configuration
   */
  getEntityConfig(entity) {
    // Define export configurations for each entity
    const entityConfigs = {
      patients: {
        model: db.Patient,
        defaultFields: ['id', 'firstName', 'lastName', 'gender', 'dateOfBirth', 'phoneNumber', 'address'],
        includes: [],
        mapToFields: (record) => ({
          'ID': record.id,
          'First Name': record.firstName,
          'Last Name': record.lastName,
          'Gender': record.gender,
          'Date of Birth': record.dateOfBirth,
          'Phone Number': record.phoneNumber,
          'Address': record.address,
          'Next of Kin': record.nextOfKin,
          'Blood Group': record.bloodGroup,
          'Allergies': record.allergies,
          'Chronic Conditions': record.chronicConditions,
          'Is Deceased': record.isDeceased ? 'Yes' : 'No',
          'Date of Death': record.dateOfDeath
        })
      },
      facilities: {
        model: db.Facility,
        defaultFields: ['id', 'name', 'type', 'lga', 'ward', 'address', 'contactPerson', 'phoneNumber'],
        includes: [],
        mapToFields: (record) => ({
          'ID': record.id,
          'Name': record.name,
          'Type': record.type,
          'LGA': record.lga,
          'Ward': record.ward,
          'Address': record.address,
          'Contact Person': record.contactPerson,
          'Phone Number': record.phoneNumber,
          'Email': record.email,
          'Is Active': record.isActive ? 'Yes' : 'No'
        })
      },
      birth_statistics: {
        model: db.BirthStatistic,
        defaultFields: ['id', 'patientId', 'facilityId', 'birthDate', 'birthWeight', 'deliveryType'],
        includes: [
          {
            model: db.Patient,
            as: 'patient',
            attributes: ['firstName', 'lastName']
          },
          {
            model: db.Facility,
            as: 'facility',
            attributes: ['name']
          }
        ],
        mapToFields: (record) => ({
          'ID': record.id,
          'Patient ID': record.patientId,
          'Patient Name': record.patient ? `${record.patient.firstName} ${record.patient.lastName}` : '',
          'Facility ID': record.facilityId,
          'Facility Name': record.facility ? record.facility.name : '',
          'Birth Date': record.birthDate,
          'Birth Time': record.birthTime,
          'Birth Weight (kg)': record.birthWeight,
          'Delivery Type': record.deliveryType,
          'APGAR Score': record.apgarScore,
          'Complications': record.complications,
          'Mother ID': record.motherId
        })
      },
      death_statistics: {
        model: db.DeathStatistic,
        defaultFields: ['id', 'patientId', 'facilityId', 'dateOfDeath', 'primaryCauseOfDeath', 'outcome'],
        includes: [
          {
            model: db.Patient,
            as: 'patient',
            attributes: ['firstName', 'lastName']
          },
          {
            model: db.Facility,
            as: 'facility',
            attributes: ['name']
          }
        ],
        mapToFields: (record) => ({
          'ID': record.id,
          'Patient ID': record.patientId,
          'Patient Name': record.patient ? `${record.patient.firstName} ${record.patient.lastName}` : '',
          'Facility ID': record.facilityId,
          'Facility Name': record.facility ? record.facility.name : '',
          'Date of Death': record.dateOfDeath,
          'Time of Death': record.timeOfDeath,
          'Primary Cause of Death': record.primaryCauseOfDeath,
          'Secondary Cause of Death': record.secondaryCauseOfDeath,
          'Place of Death': record.placeOfDeath,
          'Manner of Death': record.mannerOfDeath
        })
      },
      immunizations: {
        model: db.Immunization,
        defaultFields: ['id', 'patientId', 'facilityId', 'vaccineType', 'vaccineName', 'administrationDate', 'doseNumber'],
        includes: [
          {
            model: db.Patient,
            as: 'patient',
            attributes: ['firstName', 'lastName']
          },
          {
            model: db.Facility,
            as: 'facility',
            attributes: ['name']
          }
        ],
        mapToFields: (record) => ({
          'ID': record.id,
          'Patient ID': record.patientId,
          'Patient Name': record.patient ? `${record.patient.firstName} ${record.patient.lastName}` : '',
          'Facility ID': record.facilityId,
          'Facility Name': record.facility ? record.facility.name : '',
          'Vaccine Type': record.vaccineType,
          'Vaccine Name': record.vaccineName,
          'Dose Number': record.doseNumber,
          'Administration Date': record.administrationDate,
          'Administered By': record.administeredBy,
          'Batch Number': record.batchNumber,
          'Expiry Date': record.expiryDate,
          'Next Appointment': record.nextAppointment,
          'Status': record.status
        })
      },
      antenatal_care: {
        model: db.AntenatalCare,
        defaultFields: ['id', 'patientId', 'facilityId', 'registrationDate', 'lmp', 'edd', 'status'],
        includes: [
          {
            model: db.Patient,
            as: 'patient',
            attributes: ['firstName', 'lastName']
          },
          {
            model: db.Facility,
            as: 'facility',
            attributes: ['name']
          }
        ],
        mapToFields: (record) => ({
          'ID': record.id,
          'Patient ID': record.patientId,
          'Patient Name': record.patient ? `${record.patient.firstName} ${record.patient.lastName}` : '',
          'Facility ID': record.facilityId,
          'Facility Name': record.facility ? record.facility.name : '',
          'Registration Date': record.registrationDate,
          'Last Menstrual Period': record.lmp,
          'Expected Delivery Date': record.edd,
          'Gravida': record.gravida,
          'Para': record.para,
          'Status': record.status,
          'Outcome': record.outcome
        })
      },
      disease_cases: {
        model: db.DiseaseCase,
        defaultFields: ['id', 'patientId', 'diseaseId', 'facilityId', 'reportingDate', 'diagnosisDate', 'severity', 'status'],
        includes: [
          {
            model: db.Patient,
            as: 'patient',
            attributes: ['firstName', 'lastName']
          },
          {
            model: db.Facility,
            as: 'facility',
            attributes: ['name']
          },
          {
            model: db.DiseaseRegistry,
            as: 'disease',
            attributes: ['name']
          }
        ],
        mapToFields: (record) => ({
          'ID': record.id,
          'Patient ID': record.patientId,
          'Patient Name': record.patient ? `${record.patient.firstName} ${record.patient.lastName}` : '',
          'Disease ID': record.diseaseId,
          'Disease Name': record.disease ? record.disease.name : '',
          'Facility ID': record.facilityId,
          'Facility Name': record.facility ? record.facility.name : '',
          'Reporting Date': record.reportingDate,
          'Diagnosis Date': record.diagnosisDate,
          'Onset Date': record.onsetDate,
          'Diagnosis Type': record.diagnosisType,
          'Severity': record.severity,
          'Hospitalized': record.hospitalized ? 'Yes' : 'No',
          'Outcome': record.outcome,
          'Status': record.status
        })
      },
      family_planning_clients: {
        model: db.FamilyPlanningClient,
        defaultFields: ['id', 'patientId', 'facilityId', 'registrationDate', 'clientType', 'maritalStatus', 'status'],
        includes: [
          {
            model: db.Patient,
            as: 'patient',
            attributes: ['firstName', 'lastName']
          },
          {
            model: db.Facility,
            as: 'facility',
            attributes: ['name']
          }
        ],
        mapToFields: (record) => ({
          'ID': record.id,
          'Patient ID': record.patientId,
          'Patient Name': record.patient ? `${record.patient.firstName} ${record.patient.lastName}` : '',
          'Facility ID': record.facilityId,
          'Facility Name': record.facility ? record.facility.name : '',
          'Registration Date': record.registrationDate,
          'Client Type': record.clientType,
          'Marital Status': record.maritalStatus,
          'Number of Children': record.numberOfChildren,
          'Status': record.status
        })
      }
    };
    
    return entityConfigs[entity] || null;
  }
  
  /**
   * Export data to CSV format
   * @param {string} entity - Entity to export
   * @param {Object} filters - Query filters
   * @param {Array} fields - Fields to include in export
   * @returns {Promise<Object>} - Export result with file path
   */
  async exportToCSV(entity, filters = {}, fields = []) {
    try {
      const entityConfig = this.getEntityConfig(entity);
      
      if (!entityConfig) {
        throw new AppError(`Unsupported entity: ${entity}`, 400);
      }
      
      // Get data from database
      const queryOptions = this.buildQueryOptions(entityConfig, filters, fields);
      const records = await entityConfig.model.findAll(queryOptions);
      
      // Generate unique filename
      const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
      const filename = `${entity}_export_${timestamp}.csv`;
      const filePath = path.join(this.exportDir, filename);
      
      // Map records to export format
      const exportData = records.map(record => {
        // Convert Sequelize instance to plain object
        const plainRecord = record.get({ plain: true });
        return entityConfig.mapToFields(plainRecord);
      });
      
      // Prepare headers for CSV
      const firstRecord = exportData[0] || {};
      const headers = Object.keys(firstRecord).map(key => ({
        id: key.toLowerCase().replace(/\s+/g, '_'),
        title: key
      }));
      
      // Write to CSV file
      await writeCSV(filePath, exportData, headers);
      
      return {
        filePath,
        filename,
        entity,
        format: 'csv',
        recordCount: records.length
      };
    } catch (error) {
      if (error instanceof AppError) {
        throw error;
      }
      throw new AppError(`Failed to export data to CSV: ${error.message}`, 500);
    }
  }
  
  /**
   * Export data to Excel format
   * @param {string} entity - Entity to export
   * @param {Object} filters - Query filters
   * @param {Array} fields - Fields to include in export
   * @returns {Promise<Object>} - Export result with file path
   */
  async exportToExcel(entity, filters = {}, fields = []) {
    try {
      const entityConfig = this.getEntityConfig(entity);
      
      if (!entityConfig) {
        throw new AppError(`Unsupported entity: ${entity}`, 400);
      }
      
      // Get data from database
      const queryOptions = this.buildQueryOptions(entityConfig, filters, fields);
      const records = await entityConfig.model.findAll(queryOptions);
      
      // Generate unique filename
      const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
      const filename = `${entity}_export_${timestamp}.xlsx`;
      const filePath = path.join(this.exportDir, filename);
      
      // Map records to export format
      const exportData = records.map(record => {
        // Convert Sequelize instance to plain object
        const plainRecord = record.get({ plain: true });
        return entityConfig.mapToFields(plainRecord);
      });
      
      // Create a new Excel workbook
      const workbook = new ExcelJS.Workbook();
      workbook.creator = 'Akwa Ibom State Health Data System';
      workbook.created = new Date();
      
      // Add a worksheet
      const worksheet = workbook.addWorksheet(this.formatEntityName(entity));
      
      // Add column headers
      // src/api/services/export.service.js (continued)

      // Add column headers
      if (exportData.length > 0) {
        const firstRecord = exportData[0];
        const headers = Object.keys(firstRecord);
        
        worksheet.columns = headers.map(header => ({
          header,
          key: header.toLowerCase().replace(/\s+/g, '_'),
          width: Math.max(header.length, 15)
        }));
        
        // Format header row
        worksheet.getRow(1).font = { bold: true };
        worksheet.getRow(1).fill = {
          type: 'pattern',
          pattern: 'solid',
          fgColor: { argb: 'FFE0E0E0' }
        };
        
        // Add data
        exportData.forEach(record => {
          const row = {};
          
          // Map record data to row using column keys
          headers.forEach(header => {
            const key = header.toLowerCase().replace(/\s+/g, '_');
            row[key] = record[header];
          });
          
          worksheet.addRow(row);
        });
        
        // Add auto filter
        worksheet.autoFilter = {
          from: { row: 1, column: 1 },
          to: { row: 1, column: headers.length }
        };
        
        // Add zebra striping
        for (let i = 2; i <= exportData.length + 1; i++) {
          if (i % 2 === 0) {
            worksheet.getRow(i).fill = {
              type: 'pattern',
              pattern: 'solid',
              fgColor: { argb: 'FFF5F5F5' }
            };
          }
        }
      }
      
      // Save the workbook
      await workbook.xlsx.writeFile(filePath);
      
      return {
        filePath,
        filename,
        entity,
        format: 'excel',
        recordCount: records.length
      };
    } catch (error) {
      if (error instanceof AppError) {
        throw error;
      }
      throw new AppError(`Failed to export data to Excel: ${error.message}`, 500);
    }
  }
  
  /**
   * Export data to PDF format
   * @param {string} entity - Entity to export
   * @param {Object} filters - Query filters
   * @param {Array} fields - Fields to include in export
   * @returns {Promise<Object>} - Export result with file path
   */
  async exportToPDF(entity, filters = {}, fields = []) {
    try {
      const entityConfig = this.getEntityConfig(entity);
      
      if (!entityConfig) {
        throw new AppError(`Unsupported entity: ${entity}`, 400);
      }
      
      // Get data from database
      const queryOptions = this.buildQueryOptions(entityConfig, filters, fields);
      const records = await entityConfig.model.findAll(queryOptions);
      
      // Generate unique filename
      const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
      const filename = `${entity}_export_${timestamp}.pdf`;
      const filePath = path.join(this.exportDir, filename);
      
      // Map records to export format
      const exportData = records.map(record => {
        // Convert Sequelize instance to plain object
        const plainRecord = record.get({ plain: true });
        return entityConfig.mapToFields(plainRecord);
      });
      
      // Get headers for PDF table
      const headers = exportData.length > 0 ? Object.keys(exportData[0]) : [];
      
      // Generate PDF
      await generateTablePDF(filePath, {
        title: `${this.formatEntityName(entity)} Export`,
        headers,
        data: exportData.map(record => {
          // Convert record to lowercase keys for PDF generation
          const pdfRecord = {};
          for (const [key, value] of Object.entries(record)) {
            pdfRecord[key.toLowerCase().replace(/\s+/g, '_')] = value;
          }
          return pdfRecord;
        }),
        metadata: {
          title: `${this.formatEntityName(entity)} Export`,
          subject: 'Health Data Export',
          keywords: `${entity}, health data, export`
        }
      });
      
      return {
        filePath,
        filename,
        entity,
        format: 'pdf',
        recordCount: records.length
      };
    } catch (error) {
      if (error instanceof AppError) {
        throw error;
      }
      throw new AppError(`Failed to export data to PDF: ${error.message}`, 500);
    }
  }
  
  /**
   * Generate a report in PDF format
   * @param {string} reportType - Type of report
   * @param {Object} options - Report options
   * @returns {Promise<Object>} - Report result with file path
   */
  async generateReport(reportType, options = {}) {
    try {
      // Generate unique filename
      const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
      const filename = `${reportType}_report_${timestamp}.pdf`;
      const filePath = path.join(this.exportDir, filename);
      
      // Build report sections based on report type
      let reportTitle = '';
      let sections = [];
      
      switch (reportType) {
        case 'facility_summary':
          reportTitle = 'Healthcare Facility Summary Report';
          sections = await this.buildFacilitySummaryReport(options);
          break;
          
        case 'disease_surveillance':
          reportTitle = 'Disease Surveillance Report';
          sections = await this.buildDiseaseSurveillanceReport(options);
          break;
          
        case 'maternal_health':
          reportTitle = 'Maternal Health Report';
          sections = await this.buildMaternalHealthReport(options);
          break;
          
        case 'immunization_coverage':
          reportTitle = 'Immunization Coverage Report';
          sections = await this.buildImmunizationCoverageReport(options);
          break;
          
        default:
          throw new AppError(`Unsupported report type: ${reportType}`, 400);
      }
      
      // Generate PDF report
      await generateReportPDF(filePath, {
        title: reportTitle,
        sections,
        metadata: {
          title: reportTitle,
          subject: 'Health Data Report',
          keywords: `${reportType}, health data, report`
        }
      });
      
      return {
        filePath,
        filename,
        reportType,
        format: 'pdf'
      };
    } catch (error) {
      if (error instanceof AppError) {
        throw error;
      }
      throw new AppError(`Failed to generate report: ${error.message}`, 500);
    }
  }
  
  /**
   * Build facility summary report sections
   * @param {Object} options - Report options
   * @returns {Promise<Array>} - Report sections
   */
  async buildFacilitySummaryReport(options) {
    const { facilityId, dateFrom, dateTo } = options;
    
    // Check if facility exists
    const facility = await db.Facility.findByPk(facilityId);
    if (!facility) {
      throw new AppError(`Facility not found with ID: ${facilityId}`, 404);
    }
    
    // Build date filters
    const dateFilter = {};
    if (dateFrom || dateTo) {
      dateFilter.createdAt = {};
      if (dateFrom) {
        dateFilter.createdAt[Op.gte] = new Date(dateFrom);
      }
      if (dateTo) {
        dateFilter.createdAt[Op.lte] = new Date(dateTo);
      }
    }
    
    // Collect facility statistics
    const patientCount = await db.Patient.count({
      where: { ...dateFilter },
    });
    
    const birthCount = await db.BirthStatistic.count({
      where: { facilityId, ...dateFilter },
    });
    
    const deathCount = await db.DeathStatistic.count({
      where: { facilityId, ...dateFilter },
    });
    
    const immunizationCount = await db.Immunization.count({
      where: { facilityId, ...dateFilter },
    });
    
    const antenatalCount = await db.AntenatalCare.count({
      where: { facilityId, ...dateFilter },
    });
    
    const diseaseCount = await db.DiseaseCase.count({
      where: { facilityId, ...dateFilter },
    });
    
    const fpClientCount = await db.FamilyPlanningClient.count({
      where: { facilityId, ...dateFilter },
    });
    
    // Build statistics table
    const statisticsTable = {
      headers: ['Metric', 'Count'],
      data: [
        { metric: 'Patients', count: patientCount },
        { metric: 'Births', count: birthCount },
        { metric: 'Deaths', count: deathCount },
        { metric: 'Immunizations', count: immunizationCount },
        { metric: 'Antenatal Registrations', count: antenatalCount },
        { metric: 'Disease Cases', count: diseaseCount },
        { metric: 'Family Planning Clients', count: fpClientCount },
      ]
    };
    
    // Get disease breakdown
    const diseaseCases = await db.DiseaseCase.findAll({
      where: { facilityId, ...dateFilter },
      include: [
        {
          model: db.DiseaseRegistry,
          as: 'disease',
          attributes: ['name'],
        }
      ],
      attributes: [
        [db.sequelize.col('disease.name'), 'diseaseName'],
        [db.sequelize.fn('COUNT', db.sequelize.col('DiseaseCase.id')), 'count']
      ],
      group: [db.sequelize.col('disease.name')],
      order: [[db.sequelize.literal('count'), 'DESC']],
      limit: 10
    });
    
    const diseaseTable = {
      headers: ['Disease', 'Cases'],
      data: diseaseCases.map(row => ({
        disease: row.get('diseaseName'),
        cases: row.get('count')
      }))
    };
    
    // Build report sections
    const sections = [
      {
        title: 'Facility Information',
        text: `Name: ${facility.name}\nType: ${facility.type}\nLGA: ${facility.lga}\nAddress: ${facility.address}\nContact Person: ${facility.contactPerson}\nPhone: ${facility.phoneNumber}`
      },
      {
        title: 'Summary Statistics',
        table: statisticsTable
      },
      {
        title: 'Top Diseases',
        table: diseaseTable
      }
    ];
    
    return sections;
  }
  
  /**
   * Build disease surveillance report sections
   * @param {Object} options - Report options
   * @returns {Promise<Array>} - Report sections
   */
  async buildDiseaseSurveillanceReport(options) {
    const { diseaseId, facilityId, dateFrom, dateTo } = options;
    
    // Build filters
    const filters = {};
    
    if (diseaseId) {
      filters.diseaseId = diseaseId;
    }
    
    if (facilityId) {
      filters.facilityId = facilityId;
    }
    
    if (dateFrom || dateTo) {
      filters.reportingDate = {};
      if (dateFrom) {
        filters.reportingDate[Op.gte] = new Date(dateFrom);
      }
      if (dateTo) {
        filters.reportingDate[Op.lte] = new Date(dateTo);
      }
    }
    
    // Get disease registry if specified
    let diseaseInfo = 'All Diseases';
    if (diseaseId) {
      const disease = await db.DiseaseRegistry.findByPk(diseaseId);
      if (!disease) {
        throw new AppError(`Disease not found with ID: ${diseaseId}`, 404);
      }
      diseaseInfo = `Disease: ${disease.name}`;
    }
    
    // Get facility if specified
    let facilityInfo = 'All Facilities';
    if (facilityId) {
      const facility = await db.Facility.findByPk(facilityId);
      if (!facility) {
        throw new AppError(`Facility not found with ID: ${facilityId}`, 404);
      }
      facilityInfo = `Facility: ${facility.name}`;
    }
    
    // Get date range info
    const dateInfo = dateFrom && dateTo ?
      `Period: ${new Date(dateFrom).toLocaleDateString()} to ${new Date(dateTo).toLocaleDateString()}` :
      dateFrom ?
        `Period: From ${new Date(dateFrom).toLocaleDateString()}` :
        dateTo ?
          `Period: To ${new Date(dateTo).toLocaleDateString()}` :
          'Period: All Time';
    
    // Get case counts by disease
    const diseaseCounts = await db.DiseaseCase.findAll({
      where: filters,
      include: [
        {
          model: db.DiseaseRegistry,
          as: 'disease',
          attributes: ['name'],
        }
      ],
      attributes: [
        [db.sequelize.col('disease.name'), 'diseaseName'],
        [db.sequelize.fn('COUNT', db.sequelize.col('DiseaseCase.id')), 'count']
      ],
      group: [db.sequelize.col('disease.name')],
      order: [[db.sequelize.literal('count'), 'DESC']],
    });
    
    // Get case counts by severity
    const severityCounts = await db.DiseaseCase.findAll({
      where: filters,
      attributes: [
        'severity',
        [db.sequelize.fn('COUNT', db.sequelize.col('id')), 'count']
      ],
      group: ['severity'],
      order: [['severity', 'ASC']],
    });
    
    // Get case counts by outcome
    const outcomeCounts = await db.DiseaseCase.findAll({
      where: filters,
      attributes: [
        'outcome',
        [db.sequelize.fn('COUNT', db.sequelize.col('id')), 'count']
      ],
      group: ['outcome'],
      order: [['outcome', 'ASC']],
    });
    
    // Get case counts by facility
    const facilityCounts = await db.DiseaseCase.findAll({
      where: filters,
      include: [
        {
          model: db.Facility,
          as: 'facility',
          attributes: ['name'],
        }
      ],
      attributes: [
        [db.sequelize.col('facility.name'), 'facilityName'],
        [db.sequelize.fn('COUNT', db.sequelize.col('DiseaseCase.id')), 'count']
      ],
      group: [db.sequelize.col('facility.name')],
      order: [[db.sequelize.literal('count'), 'DESC']],
      limit: 10
    });
    
    // Format tables
    const diseaseTable = {
      headers: ['Disease', 'Cases'],
      data: diseaseCounts.map(row => ({
        disease: row.get('diseaseName'),
        cases: row.get('count')
      }))
    };
    
    const severityTable = {
      headers: ['Severity', 'Cases'],
      data: severityCounts.map(row => ({
        severity: row.severity,
        cases: row.get('count')
      }))
    };
    
    const outcomeTable = {
      headers: ['Outcome', 'Cases'],
      data: outcomeCounts.map(row => ({
        outcome: row.outcome,
        cases: row.get('count')
      }))
    };
    
    const facilityTable = {
      headers: ['Facility', 'Cases'],
      data: facilityCounts.map(row => ({
        facility: row.get('facilityName'),
        cases: row.get('count')
      }))
    };
    
    // Build report sections
    const sections = [
      {
        title: 'Disease Surveillance Report',
        text: `${diseaseInfo}\n${facilityInfo}\n${dateInfo}`
      },
      {
        title: 'Disease Breakdown',
        table: diseaseTable
      },
      {
        title: 'Severity Breakdown',
        table: severityTable
      },
      {
        title: 'Outcome Breakdown',
        table: outcomeTable
      },
      {
        title: 'Top Facilities',
        table: facilityTable
      }
    ];
    
    return sections;
  }
  
  /**
   * Build maternal health report sections
   * @param {Object} options - Report options
   * @returns {Promise<Array>} - Report sections
   */
  async buildMaternalHealthReport(options) {
    const { facilityId, dateFrom, dateTo } = options;
    
    // Build filters
    const filters = {};
    
    if (facilityId) {
      filters.facilityId = facilityId;
    }
    
    if (dateFrom || dateTo) {
      filters.registrationDate = {};
      if (dateFrom) {
        filters.registrationDate[Op.gte] = new Date(dateFrom);
      }
      if (dateTo) {
        filters.registrationDate[Op.lte] = new Date(dateTo);
      }
    }
    
    // Get facility if specified
    let facilityInfo = 'All Facilities';
    if (facilityId) {
      const facility = await db.Facility.findByPk(facilityId);
      if (!facility) {
        throw new AppError(`Facility not found with ID: ${facilityId}`, 404);
      }
      facilityInfo = `Facility: ${facility.name}`;
    }
    
    // Get date range info
    const dateInfo = dateFrom && dateTo ?
      `Period: ${new Date(dateFrom).toLocaleDateString()} to ${new Date(dateTo).toLocaleDateString()}` :
      dateFrom ?
        `Period: From ${new Date(dateFrom).toLocaleDateString()}` :
        dateTo ?
          `Period: To ${new Date(dateTo).toLocaleDateString()}` :
          'Period: All Time';
    
    // Get antenatal registrations count
    const registrationCount = await db.AntenatalCare.count({
      where: filters
    });
    
    // Get outcome breakdown
    const outcomeCounts = await db.AntenatalCare.findAll({
      where: filters,
      attributes: [
        'outcome',
        [db.sequelize.fn('COUNT', db.sequelize.col('id')), 'count']
      ],
      group: ['outcome'],
      order: [['outcome', 'ASC']],
    });
    
    // Get status breakdown
    const statusCounts = await db.AntenatalCare.findAll({
      where: filters,
      attributes: [
        'status',
        [db.sequelize.fn('COUNT', db.sequelize.col('id')), 'count']
      ],
      group: ['status'],
      order: [['status', 'ASC']],
    });
    
    // Get facility breakdown
    const facilityCounts = await db.AntenatalCare.findAll({
      where: filters,
      include: [
        {
          model: db.Facility,
          as: 'facility',
          attributes: ['name'],
        }
      ],
      attributes: [
        [db.sequelize.col('facility.name'), 'facilityName'],
        [db.sequelize.fn('COUNT', db.sequelize.col('AntenatalCare.id')), 'count']
      ],
      group: [db.sequelize.col('facility.name')],
      order: [[db.sequelize.literal('count'), 'DESC']],
      limit: 10
    });
    
    // Get birth statistics
    const births = await db.BirthStatistic.findAll({
      where: {
        ...(facilityId ? { facilityId } : {}),
        ...(dateFrom || dateTo ? {
          birthDate: {
            ...(dateFrom ? { [Op.gte]: new Date(dateFrom) } : {}),
            ...(dateTo ? { [Op.lte]: new Date(dateTo) } : {})
          }
        } : {})
      },
      attributes: [
        'deliveryType',
        [db.sequelize.fn('COUNT', db.sequelize.col('id')), 'count']
      ],
      group: ['deliveryType'],
      order: [['deliveryType', 'ASC']],
    });
    
    // Format tables
    const summaryTable = {
      headers: ['Metric', 'Count'],
      data: [
        { metric: 'Total Antenatal Registrations', count: registrationCount },
        { metric: 'Live Births', count: births.reduce((sum, row) => sum + parseInt(row.get('count')), 0) },
      ]
    };
    
    const outcomeTable = {
      headers: ['Outcome', 'Count'],
      data: outcomeCounts.map(row => ({
        outcome: row.outcome,
        count: row.get('count')
      }))
    };
    
    const statusTable = {
      headers: ['Status', 'Count'],
      data: statusCounts.map(row => ({
        status: row.status,
        count: row.get('count')
      }))
    };
    
    const facilityTable = {
      headers: ['Facility', 'Registrations'],
      data: facilityCounts.map(row => ({
        facility: row.get('facilityName'),
        registrations: row.get('count')
      }))
    };
    
    const deliveryTable = {
      headers: ['Delivery Type', 'Count'],
      data: births.map(row => ({
        delivery_type: row.deliveryType,
        count: row.get('count')
      }))
    };
    
    // Build report sections
    const sections = [
      {
        title: 'Maternal Health Report',
        text: `${facilityInfo}\n${dateInfo}`
      },
      {
        title: 'Summary',
        table: summaryTable
      },
      {
        title: 'Antenatal Care Outcomes',
        table: outcomeTable
      },
      {
        title: 'Antenatal Care Status',
        table: statusTable
      },
      {
        title: 'Delivery Types',
        table: deliveryTable
      },
      {
        title: 'Top Facilities',
        table: facilityTable
      }
    ];
    
    return sections;
  }
  
  /**
   * Build immunization coverage report sections
   * @param {Object} options - Report options
   * @returns {Promise<Array>} - Report sections
   */
  async buildImmunizationCoverageReport(options) {
    const { facilityId, dateFrom, dateTo } = options;
    
    // Build filters
    const filters = {};
    
    if (facilityId) {
      filters.facilityId = facilityId;
    }
    
    if (dateFrom || dateTo) {
      filters.administrationDate = {};
      if (dateFrom) {
        filters.administrationDate[Op.gte] = new Date(dateFrom);
      }
      if (dateTo) {
        filters.administrationDate[Op.lte] = new Date(dateTo);
      }
    }
    
    // Get facility if specified
    let facilityInfo = 'All Facilities';
    if (facilityId) {
      const facility = await db.Facility.findByPk(facilityId);
      if (!facility) {
        throw new AppError(`Facility not found with ID: ${facilityId}`, 404);
      }
      facilityInfo = `Facility: ${facility.name}`;
    }
    
    // Get date range info
    const dateInfo = dateFrom && dateTo ?
      `Period: ${new Date(dateFrom).toLocaleDateString()} to ${new Date(dateTo).toLocaleDateString()}` :
      dateFrom ?
        `Period: From ${new Date(dateFrom).toLocaleDateString()}` :
        dateTo ?
          `Period: To ${new Date(dateTo).toLocaleDateString()}` :
          'Period: All Time';
    
    // Get total immunizations count
    const totalCount = await db.Immunization.count({
      where: filters
    });
    
    // Get vaccine type breakdown
    const vaccineTypeCounts = await db.Immunization.findAll({
      where: filters,
      attributes: [
        'vaccineType',
        [db.sequelize.fn('COUNT', db.sequelize.col('id')), 'count']
      ],
      group: ['vaccineType'],
      order: [[db.sequelize.literal('count'), 'DESC']],
    });
    
    // Get status breakdown
    const statusCounts = await db.Immunization.findAll({
      where: filters,
      attributes: [
        'status',
        [db.sequelize.fn('COUNT', db.sequelize.col('id')), 'count']
      ],
      group: ['status'],
      order: [['status', 'ASC']],
    });
    
    // Get facility breakdown
    const facilityCounts = await db.Immunization.findAll({
      where: filters,
      include: [
        {
          model: db.Facility,
          as: 'facility',
          attributes: ['name'],
        }
      ],
      attributes: [
        [db.sequelize.col('facility.name'), 'facilityName'],
        [db.sequelize.fn('COUNT', db.sequelize.col('Immunization.id')), 'count']
      ],
      group: [db.sequelize.col('facility.name')],
      order: [[db.sequelize.literal('count'), 'DESC']],
      limit: 10
    });
    
    // Get dose number breakdown
    const doseCounts = await db.Immunization.findAll({
      where: filters,
      attributes: [
        'doseNumber',
        [db.sequelize.fn('COUNT', db.sequelize.col('id')), 'count']
      ],
      group: ['doseNumber'],
      order: [['doseNumber', 'ASC']],
    });
    
    // Format tables
    const summaryTable = {
      headers: ['Metric', 'Count'],
      data: [
        { metric: 'Total Immunizations', count: totalCount },
      ]
    };
    
    const vaccineTypeTable = {
      headers: ['Vaccine Type', 'Count'],
      data: vaccineTypeCounts.map(row => ({
        vaccine_type: row.vaccineType,
        count: row.get('count')
      }))
    };
    
    const statusTable = {
      headers: ['Status', 'Count'],
      data: statusCounts.map(row => ({
        status: row.status,
        count: row.get('count')
      }))
    };
    
    const doseTable = {
      headers: ['Dose Number', 'Count'],
      data: doseCounts.map(row => ({
        dose_number: row.doseNumber,
        count: row.get('count')
      }))
    };
    
    const facilityTable = {
      headers: ['Facility', 'Immunizations'],
      data: facilityCounts.map(row => ({
        facility: row.get('facilityName'),
        immunizations: row.get('count')
      }))
    };
    
    // Build report sections
    const sections = [
      {
        title: 'Immunization Coverage Report',
        text: `${facilityInfo}\n${dateInfo}`
      },
      {
        title: 'Summary',
        table: summaryTable
      },
      {
        title: 'Vaccine Type Distribution',
        table: vaccineTypeTable
      },
      {
        title: 'Dose Distribution',
        table: doseTable
      },
      {
        title: 'Status Distribution',
        table: statusTable
      },
      {
        title: 'Top Facilities',
        table: facilityTable
      }
    ];
    
    return sections;
  }
  
  /**
   * Build query options for database query
   * @param {Object} entityConfig - Entity configuration
   * @param {Object} filters - Query filters
   * @param {Array} fields - Fields to include
   * @returns {Object} - Query options
   */
  buildQueryOptions(entityConfig, filters, fields) {
    const queryOptions = {
      where: {},
      include: entityConfig.includes || []
    };
    
    // Apply filters
    if (filters) {
      // Date range filter
      if (filters.dateFrom || filters.dateTo) {
        // Find date field based on entity
        let dateField = 'createdAt';
        
        if (entityConfig.dateField) {
          dateField = entityConfig.dateField;
        } else {
          // Try to infer date field
          const possibleDateFields = ['date', 'registrationDate', 'administrationDate', 'reportingDate', 'birthDate', 'dateOfDeath'];
          
          for (const field of possibleDateFields) {
            if (entityConfig.model.rawAttributes[field]) {
              dateField = field;
              break;
            }
          }
        }
        
        // Apply date range filter
        queryOptions.where[dateField] = {};
        
        if (filters.dateFrom) {
          queryOptions.where[dateField][Op.gte] = new Date(filters.dateFrom);
        }
        
        if (filters.dateTo) {
          queryOptions.where[dateField][Op.lte] = new Date(filters.dateTo);
        }
      }
      
      // Apply other filters
      for (const [key, value] of Object.entries(filters)) {
        // Skip special filter keys
        if (['dateFrom', 'dateTo', 'page', 'limit', 'sortBy', 'sortOrder'].includes(key)) {
          continue;
        }
        
        // Apply filter
        queryOptions.where[key] = value;
      }
    }
    
    // Apply field selection
    if (fields && fields.length > 0) {
      queryOptions.attributes = fields;
    } else if (entityConfig.defaultFields) {
      queryOptions.attributes = entityConfig.defaultFields;
    }
    
    return queryOptions;
  }
  
  /**
   * Format entity name for display
   * @param {string} entity - Entity name
   * @returns {string} - Formatted entity name
   */
  formatEntityName(entity) {
    return entity
      .split('_')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ');
  }
  
  /**
   * Get all supported entities for export
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
      // src/api/services/export.service.js (continued)

      {
        name: 'family_planning_clients',
        label: 'Family Planning Clients',
        description: 'Family planning client records'
      }
    ];
  }
  
  /**
   * Get all supported report types
   * @returns {Array} - List of supported report types
   */
  getSupportedReportTypes() {
    return [
      {
        name: 'facility_summary',
        label: 'Facility Summary',
        description: 'Summary of all health data for a specific facility',
        requiredParams: ['facilityId']
      },
      {
        name: 'disease_surveillance',
        label: 'Disease Surveillance',
        description: 'Analysis of disease cases and trends',
        requiredParams: []
      },
      {
        name: 'maternal_health',
        label: 'Maternal Health',
        description: 'Analysis of antenatal care and birth statistics',
        requiredParams: []
      },
      {
        name: 'immunization_coverage',
        label: 'Immunization Coverage',
        description: 'Analysis of immunization coverage and trends',
        requiredParams: []
      }
    ];
  }
}

module.exports = new ExportService();