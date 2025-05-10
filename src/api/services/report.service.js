// src/api/services/report.service.js
const { Report, User, sequelize } = require('../../models');
const { Op } = require('sequelize');
const AppError = require('../../utils/appError');

class ReportService {
  async createReport(reportData, userId) {
    try {
      const report = await Report.create({
        ...reportData,
        createdBy: userId
      });
      
      return report;
    } catch (error) {
      throw new AppError('Failed to create report', 500);
    }
  }

  async getReportById(reportId) {
    const report = await Report.findByPk(reportId, {
      include: [
        {
          model: User,
          as: 'creator',
          attributes: ['id', 'firstName', 'lastName', 'email']
        }
      ]
    });

    if (!report) {
      throw new AppError('Report not found', 404);
    }

    return report;
  }

  async updateReport(reportId, updateData, userId) {
    const report = await this.getReportById(reportId);
    
    // Optional: Check if user has permission to update this report
    // if (report.createdBy !== userId) {
    //   throw new AppError('You do not have permission to update this report', 403);
    // }
    
    await report.update(updateData);
    return report;
  }

  async deleteReport(reportId, userId) {
    const report = await this.getReportById(reportId);
    
    // Optional: Check if user has permission to delete this report
    // if (report.createdBy !== userId) {
    //   throw new AppError('You do not have permission to delete this report', 403);
    // }
    
    await report.destroy();
    return { success: true };
  }

  async searchReports(searchParams) {
    const { title, type, category, createdBy, page, limit } = searchParams;
    
    const whereClause = {};
    
    if (title) {
      whereClause.title = { [Op.iLike]: `%${title}%` };
    }
    
    if (type) {
      whereClause.type = type;
    }
    
    if (category) {
      whereClause.category = category;
    }
    
    if (createdBy) {
      whereClause.createdBy = createdBy;
    }
    
    const offset = (page - 1) * limit;
    
    const { rows, count } = await Report.findAndCountAll({
      where: whereClause,
      include: [
        {
          model: User,
          as: 'creator',
          attributes: ['id', 'firstName', 'lastName', 'email']
        }
      ],
      order: [['createdAt', 'DESC']],
      limit,
      offset
    });
    
    return {
      data: rows,
      meta: {
        total: count,
        page,
        limit,
        totalPages: Math.ceil(count / limit)
      }
    };
  }

  async runReport(reportId, parameters) {
    const report = await this.getReportById(reportId);
    
    // Merge provided parameters with default parameters
    const mergedParams = {
      ...report.parameters,
      ...parameters
    };
    
    let results;
    
    // For custom reports with SQL queries
    if (report.type === 'custom' && report.query) {
      try {
        // Parse the query template and replace parameter placeholders
        let parsedQuery = report.query;
        Object.entries(mergedParams || {}).forEach(([key, value]) => {
          // Replace placeholders in the format :paramName or ${paramName}
          parsedQuery = parsedQuery.replace(new RegExp(`:${key}|\\$\\{${key}\\}`, 'g'), 
            typeof value === 'string' ? `'${value}'` : value);
        });
        
        // Execute the custom query
        const [queryResults] = await sequelize.query(parsedQuery);
        results = queryResults;
      } catch (error) {
        throw new AppError(`Failed to execute report query: ${error.message}`, 500);
      }
    } else {
      // For standard reports, implement predefined report logic based on category
      results = await this.executeStandardReport(report.category, mergedParams);
    }
    
    // Update the lastRunAt timestamp
    await report.update({ lastRunAt: new Date() });
    
    return {
      report: {
        id: report.id,
        title: report.title,
        category: report.category,
        type: report.type,
        lastRunAt: report.lastRunAt
      },
      parameters: mergedParams,
      results
    };
  }

  async executeStandardReport(category, parameters) {
    // Implement standard report logic based on category
    switch (category) {
      case 'maternal':
        return this.generateMaternalReport(parameters);
      case 'child':
        return this.generateChildReport(parameters);
      case 'disease':
        return this.generateDiseaseReport(parameters);
      case 'facility':
        return this.generateFacilityReport(parameters);
      case 'summary':
        return this.generateSummaryReport(parameters);
      default:
        throw new AppError(`Unsupported report category: ${category}`, 400);
    }
  }

  // Implement specific report generators
  async generateMaternalReport(parameters) {
    // Sample implementation - replace with actual logic
    const { startDate, endDate, facilityId } = parameters || {};
    
    // SQL query to get maternal health statistics
    const query = `
      SELECT 
        f.name AS facility_name,
        COUNT(a.id) AS total_anc_visits,
        COUNT(DISTINCT p.id) AS unique_patients,
        AVG(a.gestationalAge) AS avg_gestational_age
      FROM "AntenatalCare" a
      JOIN "Patients" p ON a.patientId = p.id
      JOIN "Facilities" f ON p.facilityId = f.id
      WHERE 1=1
      ${startDate ? `AND a."visitDate" >= '${startDate}'` : ''}
      ${endDate ? `AND a."visitDate" <= '${endDate}'` : ''}
      ${facilityId ? `AND f.id = '${facilityId}'` : ''}
      GROUP BY f.name
      ORDER BY total_anc_visits DESC
    `;
    
    const [results] = await sequelize.query(query);
    return results;
  }

  async generateChildReport(parameters) {
    // Implement child health report logic
    const { startDate, endDate, facilityId, ageGroup } = parameters || {};
    
    // Sample query for child immunization coverage
    const query = `
      SELECT 
        f.name AS facility_name,
        i.vaccine,
        COUNT(i.id) AS total_vaccinations,
        COUNT(DISTINCT i.patientId) AS unique_patients
      FROM "Immunizations" i
      JOIN "Patients" p ON i.patientId = p.id
      JOIN "Facilities" f ON p.facilityId = f.id
      WHERE 1=1
      ${startDate ? `AND i."administeredDate" >= '${startDate}'` : ''}
      ${endDate ? `AND i."administeredDate" <= '${endDate}'` : ''}
      ${facilityId ? `AND f.id = '${facilityId}'` : ''}
      ${ageGroup ? `AND p.ageGroup = '${ageGroup}'` : ''}
      GROUP BY f.name, i.vaccine
      ORDER BY f.name, total_vaccinations DESC
    `;
    
    const [results] = await sequelize.query(query);
    return results;
  }

  async generateDiseaseReport(parameters) {
    // Implement disease surveillance report logic
    const { startDate, endDate, facilityId, disease } = parameters || {};
    
    const query = `
      SELECT 
        f.name AS facility_name,
        cd.disease,
        COUNT(cd.id) AS total_cases,
        SUM(CASE WHEN cd.outcome = 'recovered' THEN 1 ELSE 0 END) AS recovered,
        SUM(CASE WHEN cd.outcome = 'deceased' THEN 1 ELSE 0 END) AS deceased,
        SUM(CASE WHEN cd.outcome = 'ongoing' THEN 1 ELSE 0 END) AS ongoing
      FROM "CommunicableDiseases" cd
      JOIN "Patients" p ON cd.patientId = p.id
      JOIN "Facilities" f ON p.facilityId = f.id
      WHERE 1=1
      ${startDate ? `AND cd."diagnosisDate" >= '${startDate}'` : ''}
      ${endDate ? `AND cd."diagnosisDate" <= '${endDate}'` : ''}
      ${facilityId ? `AND f.id = '${facilityId}'` : ''}
      ${disease ? `AND cd.disease = '${disease}'` : ''}
      GROUP BY f.name, cd.disease
      ORDER BY total_cases DESC
    `;
    
    const [results] = await sequelize.query(query);
    return results;
  }

  async generateFacilityReport(parameters) {
    // Implement facility performance report logic
    const { startDate, endDate, facilityId, facilityType } = parameters || {};
    
    const query = `
      SELECT 
        f.name AS facility_name,
        f.type AS facility_type,
        COUNT(DISTINCT p.id) AS total_patients,
        COUNT(DISTINCT a.id) AS anc_visits,
        COUNT(DISTINCT i.id) AS immunizations,
        COUNT(DISTINCT cd.id) AS disease_cases,
        COUNT(DISTINCT fp.id) AS family_planning_services
      FROM "Facilities" f
      LEFT JOIN "Patients" p ON f.id = p.facilityId
      LEFT JOIN "AntenatalCare" a ON p.id = a.patientId
      LEFT JOIN "Immunizations" i ON p.id = i.patientId
      LEFT JOIN "CommunicableDiseases" cd ON p.id = cd.patientId
      LEFT JOIN "FamilyPlanning" fp ON p.id = fp.patientId
      WHERE 1=1
      ${facilityId ? `AND f.id = '${facilityId}'` : ''}
      ${facilityType ? `AND f.type = '${facilityType}'` : ''}
      ${startDate ? `AND (
        (a.id IS NULL OR a."visitDate" >= '${startDate}') AND
        (i.id IS NULL OR i."administeredDate" >= '${startDate}') AND
        (cd.id IS NULL OR cd."diagnosisDate" >= '${startDate}') AND
        (fp.id IS NULL OR fp."visitDate" >= '${startDate}')
      )` : ''}
      ${endDate ? `AND (
        (a.id IS NULL OR a."visitDate" <= '${endDate}') AND
        (i.id IS NULL OR i."administeredDate" <= '${endDate}') AND
        (cd.id IS NULL OR cd."diagnosisDate" <= '${endDate}') AND
        (fp.id IS NULL OR fp."visitDate" <= '${endDate}')
      )` : ''}
      GROUP BY f.id, f.name, f.type
      ORDER BY total_patients DESC
    `;
    
    const [results] = await sequelize.query(query);
    return results;
  }

  async generateSummaryReport(parameters) {
    // Implement summary statistics report logic
    const { startDate, endDate } = parameters || {};
    
    const query = `
      SELECT 
        COUNT(DISTINCT f.id) AS total_facilities,
        COUNT(DISTINCT p.id) AS total_patients,
        COUNT(DISTINCT a.id) AS total_anc_visits,
        COUNT(DISTINCT i.id) AS total_immunizations,
        COUNT(DISTINCT cd.id) AS total_disease_cases,
        COUNT(DISTINCT fp.id) AS total_family_planning_services,
        COUNT(DISTINCT b.id) AS total_births,
        COUNT(DISTINCT d.id) AS total_deaths
      FROM "Facilities" f
      LEFT JOIN "Patients" p ON f.id = p.facilityId
      LEFT JOIN "AntenatalCare" a ON p.id = a.patientId
      LEFT JOIN "Immunizations" i ON p.id = i.patientId
      LEFT JOIN "CommunicableDiseases" cd ON p.id = cd.patientId
      LEFT JOIN "FamilyPlanning" fp ON p.id = fp.patientId
      LEFT JOIN "Births" b ON p.id = b.patientId
      LEFT JOIN "Deaths" d ON p.id = d.patientId
      WHERE 1=1
      ${startDate ? `AND (
        (a.id IS NULL OR a."visitDate" >= '${startDate}') AND
        (i.id IS NULL OR i."administeredDate" >= '${startDate}') AND
        (cd.id IS NULL OR cd."diagnosisDate" >= '${startDate}') AND
        (fp.id IS NULL OR fp."visitDate" >= '${startDate}') AND
        (b.id IS NULL OR b."birthDate" >= '${startDate}') AND
        (d.id IS NULL OR d."deathDate" >= '${startDate}')
      )` : ''}
      ${endDate ? `AND (
        (a.id IS NULL OR a."visitDate" <= '${endDate}') AND
        (i.id IS NULL OR i."administeredDate" <= '${endDate}') AND
        (cd.id IS NULL OR cd."diagnosisDate" <= '${endDate}') AND
        (fp.id IS NULL OR fp."visitDate" <= '${endDate}') AND
        (b.id IS NULL OR b."birthDate" <= '${endDate}') AND
        (d.id IS NULL OR d."deathDate" <= '${endDate}')
      )` : ''}
    `;
    
    const [results] = await sequelize.query(query);
    return results.length > 0 ? results[0] : {};
  }
}

module.exports = new ReportService();