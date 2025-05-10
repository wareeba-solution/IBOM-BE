// src/api/services/dashboard.service.js
const { sequelize } = require('../../models');
const AppError = require('../../utils/appError');

class DashboardService {
  async getSummaryStats(parameters) {
    const { startDate, endDate, facilityId } = parameters || {};
    
    // Base WHERE clause
    let whereClause = '1=1';
    if (startDate) {
      whereClause += ` AND ((b.id IS NULL OR b."birthDate" >= '${startDate}')
                      AND (d.id IS NULL OR d."deathDate" >= '${startDate}')
                      AND (a.id IS NULL OR a."visitDate" >= '${startDate}')
                      AND (i.id IS NULL OR i."administeredDate" >= '${startDate}')
                      AND (cd.id IS NULL OR cd."diagnosisDate" >= '${startDate}')
                      AND (fp.id IS NULL OR fp."visitDate" >= '${startDate}'))`;
    }
    
    if (endDate) {
      whereClause += ` AND ((b.id IS NULL OR b."birthDate" <= '${endDate}')
                      AND (d.id IS NULL OR d."deathDate" <= '${endDate}')
                      AND (a.id IS NULL OR a."visitDate" <= '${endDate}')
                      AND (i.id IS NULL OR i."administeredDate" <= '${endDate}')
                      AND (cd.id IS NULL OR cd."diagnosisDate" <= '${endDate}')
                      AND (fp.id IS NULL OR fp."visitDate" <= '${endDate}'))`;
    }
    
    if (facilityId) {
      whereClause += ` AND f.id = '${facilityId}'`;
    }
    
    // Main summary query
    const query = `
      SELECT 
        COUNT(DISTINCT p.id) AS total_patients,
        COUNT(DISTINCT b.id) AS total_births,
        COUNT(DISTINCT d.id) AS total_deaths,
        COUNT(DISTINCT a.id) AS total_anc_visits,
        COUNT(DISTINCT i.id) AS total_immunizations,
        COUNT(DISTINCT cd.id) AS total_disease_cases,
        COUNT(DISTINCT fp.id) AS total_family_planning_visits
      FROM "Facilities" f
      LEFT JOIN "Patients" p ON f.id = p.facilityId
      LEFT JOIN "Births" b ON p.id = b.patientId
      LEFT JOIN "Deaths" d ON p.id = d.patientId
      LEFT JOIN "AntenatalCare" a ON p.id = a.patientId
      LEFT JOIN "Immunizations" i ON p.id = i.patientId
      LEFT JOIN "CommunicableDiseases" cd ON p.id = cd.patientId
      LEFT JOIN "FamilyPlanning" fp ON p.id = fp.patientId
      WHERE ${whereClause}
    `;
    
    const [results] = await sequelize.query(query);
    return results.length > 0 ? results[0] : {};
  }
  
  async getMonthlyTrends(parameters) {
    const { year, facilityId } = parameters || {};
    const currentYear = year || new Date().getFullYear();
    
    let facilityFilter = '';
    if (facilityId) {
      facilityFilter = ` AND f.id = '${facilityId}'`;
    }
    
    // Births by month
    const birthsQuery = `
      SELECT 
        EXTRACT(MONTH FROM b."birthDate") AS month,
        COUNT(b.id) AS count
      FROM "Births" b
      JOIN "Patients" p ON b.patientId = p.id
      JOIN "Facilities" f ON p.facilityId = f.id
      WHERE EXTRACT(YEAR FROM b."birthDate") = ${currentYear}${facilityFilter}
      GROUP BY month
      ORDER BY month
    `;
    
    // Deaths by month
    const deathsQuery = `
      SELECT 
        EXTRACT(MONTH FROM d."deathDate") AS month,
        COUNT(d.id) AS count
      FROM "Deaths" d
      JOIN "Patients" p ON d.patientId = p.id
      JOIN "Facilities" f ON p.facilityId = f.id
      WHERE EXTRACT(YEAR FROM d."deathDate") = ${currentYear}${facilityFilter}
      GROUP BY month
      ORDER BY month
    `;
    
    // Immunizations by month
    const immunizationsQuery = `
      SELECT 
        EXTRACT(MONTH FROM i."administeredDate") AS month,
        COUNT(i.id) AS count
      FROM "Immunizations" i
      JOIN "Patients" p ON i.patientId = p.id
      JOIN "Facilities" f ON p.facilityId = f.id
      WHERE EXTRACT(YEAR FROM i."administeredDate") = ${currentYear}${facilityFilter}
      GROUP BY month
      ORDER BY month
    `;
    
    // ANC visits by month
    const ancVisitsQuery = `
      SELECT 
        EXTRACT(MONTH FROM a."visitDate") AS month,
        COUNT(a.id) AS count
      FROM "AntenatalCare" a
      JOIN "Patients" p ON a.patientId = p.id
      JOIN "Facilities" f ON p.facilityId = f.id
      WHERE EXTRACT(YEAR FROM a."visitDate") = ${currentYear}${facilityFilter}
      GROUP BY month
      ORDER BY month
    `;
    
    // Disease cases by month
    const diseaseCasesQuery = `
      SELECT 
        EXTRACT(MONTH FROM cd."diagnosisDate") AS month,
        COUNT(cd.id) AS count
      FROM "CommunicableDiseases" cd
      JOIN "Patients" p ON cd.patientId = p.id
      JOIN "Facilities" f ON p.facilityId = f.id
      WHERE EXTRACT(YEAR FROM cd."diagnosisDate") = ${currentYear}${facilityFilter}
      GROUP BY month
      ORDER BY month
    `;
    
    // Execute all queries in parallel
    const [births, deaths, immunizations, ancVisits, diseaseCases] = await Promise.all([
      sequelize.query(birthsQuery).then(([results]) => results),
      sequelize.query(deathsQuery).then(([results]) => results),
      sequelize.query(immunizationsQuery).then(([results]) => results),
      sequelize.query(ancVisitsQuery).then(([results]) => results),
      sequelize.query(diseaseCasesQuery).then(([results]) => results)
    ]);
    
    // Process results into a uniform format
    const processMonthlyData = (data) => {
      const months = Array.from({ length: 12 }, (_, i) => i + 1);
      const resultMap = new Map(data.map(item => [Number(item.month), Number(item.count)]));
      
      return months.map(month => ({
        month,
        count: resultMap.get(month) || 0
      }));
    };
    
    return {
      births: processMonthlyData(births),
      deaths: processMonthlyData(deaths),
      immunizations: processMonthlyData(immunizations),
      ancVisits: processMonthlyData(ancVisits),
      diseaseCases: processMonthlyData(diseaseCases)
    };
  }
  
  async getTopFacilities(parameters) {
    const { limit = 5, metric = 'patients', startDate, endDate } = parameters || {};
    
    let dateFilter = '';
    if (startDate && endDate) {
      dateFilter = ` AND (
        (b.id IS NULL OR (b."birthDate" >= '${startDate}' AND b."birthDate" <= '${endDate}'))
        AND (d.id IS NULL OR (d."deathDate" >= '${startDate}' AND d."deathDate" <= '${endDate}'))
        AND (a.id IS NULL OR (a."visitDate" >= '${startDate}' AND a."visitDate" <= '${endDate}'))
        AND (i.id IS NULL OR (i."administeredDate" >= '${startDate}' AND i."administeredDate" <= '${endDate}'))
        AND (cd.id IS NULL OR (cd."diagnosisDate" >= '${startDate}' AND cd."diagnosisDate" <= '${endDate}'))
      )`;
    }
    
    let metricColumn;
    switch (metric) {
      case 'patients':
        metricColumn = 'COUNT(DISTINCT p.id) AS count';
        break;
      case 'births':
        metricColumn = 'COUNT(DISTINCT b.id) AS count';
        break;
      case 'deaths':
        metricColumn = 'COUNT(DISTINCT d.id) AS count';
        break;
      case 'immunizations':
        metricColumn = 'COUNT(DISTINCT i.id) AS count';
        break;
      case 'anc':
        metricColumn = 'COUNT(DISTINCT a.id) AS count';
        break;
      case 'diseases':
        metricColumn = 'COUNT(DISTINCT cd.id) AS count';
        break;
      default:
        metricColumn = 'COUNT(DISTINCT p.id) AS count';
    }
    
    const query = `
      SELECT 
        f.id,
        f.name,
        f.type,
        ${metricColumn}
      FROM "Facilities" f
      LEFT JOIN "Patients" p ON f.id = p.facilityId
      LEFT JOIN "Births" b ON p.id = b.patientId
      LEFT JOIN "Deaths" d ON p.id = d.patientId
      LEFT JOIN "AntenatalCare" a ON p.id = a.patientId
      LEFT JOIN "Immunizations" i ON p.id = i.patientId
      LEFT JOIN "CommunicableDiseases" cd ON p.id = cd.patientId
      WHERE 1=1${dateFilter}
      GROUP BY f.id, f.name, f.type
      ORDER BY count DESC
      LIMIT ${limit}
    `;
    
    const [results] = await sequelize.query(query);
    return results;
  }
  
  async getDiseaseDistribution(parameters) {
    const { startDate, endDate, facilityId, limit = 10 } = parameters || {};
    
    let whereClause = '1=1';
    if (startDate) {
      whereClause += ` AND cd."diagnosisDate" >= '${startDate}'`;
    }
    
    if (endDate) {
      whereClause += ` AND cd."diagnosisDate" <= '${endDate}'`;
    }
    
    if (facilityId) {
      whereClause += ` AND f.id = '${facilityId}'`;
    }
    
    const query = `
      SELECT 
        cd.disease,
        COUNT(cd.id) AS count,
        COUNT(cd.id) * 100.0 / (SELECT COUNT(*) FROM "CommunicableDiseases") AS percentage
      FROM "CommunicableDiseases" cd
      JOIN "Patients" p ON cd.patientId = p.id
      JOIN "Facilities" f ON p.facilityId = f.id
      WHERE ${whereClause}
      GROUP BY cd.disease
      ORDER BY count DESC
      LIMIT ${limit}
    `;
    
    const [results] = await sequelize.query(query);
    return results;
  }
  
  async getImmunizationCoverage(parameters) {
    const { startDate, endDate, facilityId, vaccine } = parameters || {};
    
    let whereClause = '1=1';
    if (startDate) {
      whereClause += ` AND i."administeredDate" >= '${startDate}'`;
    }
    
    if (endDate) {
      whereClause += ` AND i."administeredDate" <= '${endDate}'`;
    }
    
    if (facilityId) {
      whereClause += ` AND f.id = '${facilityId}'`;
    }
    
    if (vaccine) {
      whereClause += ` AND i.vaccine = '${vaccine}'`;
    }
    
    const query = `
      SELECT 
        i.vaccine,
        COUNT(i.id) AS total_administered,
        COUNT(DISTINCT i.patientId) AS unique_patients,
        COUNT(CASE WHEN i.doseNumber = 1 THEN 1 END) AS first_dose,
        COUNT(CASE WHEN i.doseNumber > 1 THEN 1 END) AS follow_up_doses
      FROM "Immunizations" i
      JOIN "Patients" p ON i.patientId = p.id
      JOIN "Facilities" f ON p.facilityId = f.id
      WHERE ${whereClause}
      GROUP BY i.vaccine
      ORDER BY total_administered DESC
    `;
    
    const [results] = await sequelize.query(query);
    return results;
  }
}

module.exports = new DashboardService();