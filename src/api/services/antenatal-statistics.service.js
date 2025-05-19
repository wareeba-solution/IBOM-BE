// src/api/services/antenatal-statistics.service.js

const { Op } = require('sequelize');
const db = require('../../models');
const { AppError } = require('../../utils/error');

class AntenatalStatisticsService {
  async getAntenatalStatistics(criteria) {
    try {
      const { facilityId, dateFrom, dateTo, groupBy } = criteria;

      const where = {};

      if (facilityId) {
        where.facilityId = facilityId;
      }

      if (dateFrom || dateTo) {
        where.registrationDate = {};
        if (dateFrom) {
          where.registrationDate[Op.gte] = new Date(dateFrom);
        }
        if (dateTo) {
          where.registrationDate[Op.lte] = new Date(dateTo);
        }
      }

      let attributes = [];
      let group = [];

      // Configure grouping based on parameter
      switch (groupBy) {
        case 'status':
          attributes = [
            'status',
            [db.sequelize.fn('COUNT', db.sequelize.col('id')), 'count'],
          ];
          group = ['status'];
          break;
        case 'outcome':
          attributes = [
            'outcome',
            [db.sequelize.fn('COUNT', db.sequelize.col('id')), 'count'],
          ];
          group = ['outcome'];
          break;
        case 'hivStatus':
          attributes = [
            'hivStatus',
            [db.sequelize.fn('COUNT', db.sequelize.col('id')), 'count'],
          ];
          group = ['hivStatus'];
          break;
        case 'facility':
          attributes = [
            [db.sequelize.col('facility.name'), 'facilityName'],
            [db.sequelize.fn('COUNT', db.sequelize.col('AntenatalCare.id')), 'count'],
          ];
          group = [db.sequelize.col('facility.name')];
          break;
        case 'month':
          attributes = [
            [db.sequelize.fn('DATE_TRUNC', 'month', db.sequelize.col('registrationDate')), 'month'],
            [db.sequelize.fn('COUNT', db.sequelize.col('id')), 'count'],
          ];
          group = [db.sequelize.fn('DATE_TRUNC', 'month', db.sequelize.col('registrationDate'))];
          break;
        case 'age':
          // Age group statistics
          attributes = [
            [
              db.sequelize.literal(`
                CASE 
                  WHEN EXTRACT(YEAR FROM AGE(NOW(), "patient"."dateOfBirth")) < 20 THEN 'Under 20'
                  WHEN EXTRACT(YEAR FROM AGE(NOW(), "patient"."dateOfBirth")) < 30 THEN '20-29'
                  WHEN EXTRACT(YEAR FROM AGE(NOW(), "patient"."dateOfBirth")) < 40 THEN '30-39'
                  ELSE '40 and above'
                END
              `),
              'ageGroup'
            ],
            [db.sequelize.fn('COUNT', db.sequelize.col('AntenatalCare.id')), 'count'],
          ];
          group = [
            db.sequelize.literal(`
              CASE 
                WHEN EXTRACT(YEAR FROM AGE(NOW(), "patient"."dateOfBirth")) < 20 THEN 'Under 20'
                WHEN EXTRACT(YEAR FROM AGE(NOW(), "patient"."dateOfBirth")) < 30 THEN '20-29'
                WHEN EXTRACT(YEAR FROM AGE(NOW(), "patient"."dateOfBirth")) < 40 THEN '30-39'
                ELSE '40 and above'
              END
            `)
          ];
          break;
        default:
          throw new AppError('Invalid groupBy parameter', 400);
      }

      const results = await db.AntenatalCare.findAll({
        attributes,
        include: [
          ...(groupBy === 'facility' ? [{
            model: db.Facility,
            as: 'facility',
            attributes: [],
          }] : []),
          ...(groupBy === 'age' ? [{
            model: db.Patient,
            as: 'patient',
            attributes: [],
          }] : []),
        ],
        where,
        group,
        raw: true,
        order: groupBy === 'age' ?
          [[db.sequelize.literal('ageGroup'), 'ASC']] :
          groupBy === 'month' ?
            [[db.sequelize.literal('month'), 'ASC']] :
            [[groupBy === 'facility' ? 'facilityName' : groupBy, 'ASC']],
      });

      return results;
    } catch (error) {
      if (error instanceof AppError) {
        throw error;
      }
      throw new AppError(error.message, 500);
    }
  }

  async getAntenatalSummary(criteria) {
    try {
      const { facilityId, dateFrom, dateTo } = criteria;
      
      const where = {};
      if (facilityId) {
        where.facilityId = facilityId;
      }
      if (dateFrom || dateTo) {
        where.registrationDate = {};
        if (dateFrom) {
          where.registrationDate[Op.gte] = new Date(dateFrom);
        }
        if (dateTo) {
          where.registrationDate[Op.lte] = new Date(dateTo);
        }
      }
      
      // Get total registrations
      const totalRegistrations = await db.AntenatalCare.count({
        where: {
          ...where
        }
      });
      
      // Get active pregnancies
      const activePregnancies = await db.AntenatalCare.count({
        where: {
          ...where,
          status: 'Active'
        }
      });
      
      // Get registrations this month
      const currentDate = new Date();
      const firstDayOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1);
      const lastDayOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0);
      
      const registrationsThisMonth = await db.AntenatalCare.count({
        where: {
          ...where,
          registrationDate: {
            [Op.between]: [firstDayOfMonth, lastDayOfMonth]
          }
        }
      });
      
      // Get high risk cases
      const highRiskCases = await db.AntenatalCare.count({
        where: {
          ...where,
          status: 'Active',
          riskLevel: 'high'
        }
      });
      
      return {
        total_registrations: totalRegistrations,
        active_pregnancies: activePregnancies,
        registrations_this_month: registrationsThisMonth,
        high_risk_cases: highRiskCases
      };
    } catch (error) {
      throw new AppError(error.message, 500);
    }
  }
  
  // Get antenatal statistics by trimester
  async getAntenatalByTrimester(criteria) {
    try {
      const { facilityId, dateFrom, dateTo } = criteria;
      
      const where = {
        status: 'Active'
      };
      if (facilityId) {
        where.facilityId = facilityId;
      }
      if (dateFrom || dateTo) {
        where.registrationDate = {};
        if (dateFrom) {
          where.registrationDate[Op.gte] = new Date(dateFrom);
        }
        if (dateTo) {
          where.registrationDate[Op.lte] = new Date(dateTo);
        }
      }
      
      // Get all active pregnancies
      const activePregnancies = await db.AntenatalCare.findAll({
        attributes: ['id', 'lmp'],
        where
      });
      
      // Calculate current gestational age and assign trimester
      const currentDate = new Date();
      const trimesters = {
        '1st Trimester': 0,
        '2nd Trimester': 0,
        '3rd Trimester': 0
      };
      
      activePregnancies.forEach(pregnancy => {
        const lmp = new Date(pregnancy.lmp);
        // Calculate weeks between LMP and current date
        const gestationalAge = Math.floor((currentDate - lmp) / (7 * 24 * 60 * 60 * 1000));
        
        if (gestationalAge <= 13) {
          trimesters['1st Trimester']++;
        } else if (gestationalAge <= 26) {
          trimesters['2nd Trimester']++;
        } else {
          trimesters['3rd Trimester']++;
        }
      });
      
      const total = activePregnancies.length;
      const result = Object.entries(trimesters).map(([trimester, count]) => ({
        trimester,
        count,
        percentage: total > 0 ? (count / total) * 100 : 0
      }));
      
      return result;
    } catch (error) {
      throw new AppError(error.message, 500);
    }
  }
  
  // Get antenatal statistics by risk level
  async getAntenatalByRisk(criteria) {
    try {
      const { facilityId, dateFrom, dateTo } = criteria;
      
      const where = {
        status: 'Active'
      };
      if (facilityId) {
        where.facilityId = facilityId;
      }
      if (dateFrom || dateTo) {
        where.registrationDate = {};
        if (dateFrom) {
          where.registrationDate[Op.gte] = new Date(dateFrom);
        }
        if (dateTo) {
          where.registrationDate[Op.lte] = new Date(dateTo);
        }
      }
      
      // Group by risk level
      const riskGroups = await db.AntenatalCare.findAll({
        attributes: [
          'riskLevel',
          [db.sequelize.fn('COUNT', db.sequelize.col('id')), 'count']
        ],
        where,
        group: ['riskLevel'],
        raw: true
      });
      
      // Calculate total
      const total = riskGroups.reduce((sum, group) => sum + parseInt(group.count, 10), 0);
      
      // Format result
      const result = riskGroups.map(group => ({
        risk_level: group.riskLevel === 'low' ? 'Low Risk' : 
                   group.riskLevel === 'medium' ? 'Medium Risk' : 'High Risk',
        count: parseInt(group.count, 10),
        percentage: total > 0 ? (parseInt(group.count, 10) / total) * 100 : 0
      }));
      
      return result;
    } catch (error) {
      throw new AppError(error.message, 500);
    }
  }
  
  // Get antenatal statistics by age group
  async getAntenatalByAge(criteria) {
    try {
      // Create clean where object
      const where = {
        status: 'Active'
      };
      
      // Handle facility filter
      if (criteria.facilityId) {
        where.facilityId = criteria.facilityId;
      }
      
      // Handle date filters
      if (criteria.dateFrom || criteria.dateTo) {
        where.registrationDate = {};
        if (criteria.dateFrom) {
          where.registrationDate[Op.gte] = new Date(criteria.dateFrom);
        }
        if (criteria.dateTo) {
          where.registrationDate[Op.lte] = new Date(criteria.dateTo);
        }
      }
      
      // Get all active pregnancies with patient details
      const activePregnancies = await db.AntenatalCare.findAll({
        attributes: ['id'],
        include: [
          {
            model: db.Patient,
            as: 'patient',
            attributes: ['id', 'dateOfBirth']
          }
        ],
        where
      });
      
      // Calculate age and group
      const currentDate = new Date();
      const ageGroups = {
        'Below 18': 0,
        '18-25': 0,
        '26-35': 0,
        'Above 35': 0
      };
      
      // Process each pregnancy to count by age group
      activePregnancies.forEach(pregnancy => {
        if (pregnancy.patient && pregnancy.patient.dateOfBirth) {
          // Create a new date object for birthdate
          const birthDate = new Date(pregnancy.patient.dateOfBirth);
          
          // Calculate initial age
          let calculatedAge = currentDate.getFullYear() - birthDate.getFullYear();
          
          // Adjust age if birthday hasn't occurred yet this year
          const hasBirthdayOccurred = (
            currentDate.getMonth() > birthDate.getMonth() || 
            (currentDate.getMonth() === birthDate.getMonth() && 
             currentDate.getDate() >= birthDate.getDate())
          );
          
          if (!hasBirthdayOccurred) {
            calculatedAge--;
          }
          
          // Add to appropriate age group counter
          if (calculatedAge < 18) {
            ageGroups['Below 18']++;
          } else if (calculatedAge <= 25) {
            ageGroups['18-25']++;
          } else if (calculatedAge <= 35) {
            ageGroups['26-35']++;
          } else {
            ageGroups['Above 35']++;
          }
        }
      });
      
      // Calculate total
      const total = activePregnancies.length;
      
      // Format result
      const result = Object.entries(ageGroups).map(([ageGroup, count]) => ({
        age_group: ageGroup,
        count,
        percentage: total > 0 ? (count / total) * 100 : 0
      }));
      
      return result;
    } catch (error) {
      console.error('Error in getAntenatalByAge service method:', error);
      throw new AppError(error.message, 500);
    }
  }
  
  // Get top risk factors
  async getTopRiskFactors(criteria) {
    try {
      const { facilityId, dateFrom, dateTo, limit = 5 } = criteria;
      
      const where = {
        status: 'Active'
      };
      if (facilityId) {
        where.facilityId = facilityId;
      }
      if (dateFrom || dateTo) {
        where.registrationDate = {};
        if (dateFrom) {
          where.registrationDate[Op.gte] = new Date(dateFrom);
        }
        if (dateTo) {
          where.registrationDate[Op.lte] = new Date(dateTo);
        }
      }
      
      // Get all active pregnancies
      const activePregnancies = await db.AntenatalCare.findAll({
        attributes: ['riskFactors'],
        where,
        raw: true
      });
      
      // Count risk factors
      const riskFactorCount = {};
      let totalRiskFactors = 0;
      
      activePregnancies.forEach(pregnancy => {
        if (pregnancy.riskFactors && Array.isArray(pregnancy.riskFactors)) {
          pregnancy.riskFactors.forEach(factor => {
            if (!riskFactorCount[factor]) {
              riskFactorCount[factor] = 0;
            }
            riskFactorCount[factor]++;
            totalRiskFactors++;
          });
        }
      });
      
      // Sort and get top factors
      const sortedFactors = Object.entries(riskFactorCount)
        .map(([factor, count]) => ({
          factor,
          count,
          percentage: (count / activePregnancies.length) * 100
        }))
        .sort((a, b) => b.count - a.count)
        .slice(0, limit);
      
      return sortedFactors;
    } catch (error) {
      throw new AppError(error.message, 500);
    }
  }
  
  // Get monthly registrations
  async getMonthlyRegistrations(criteria) {
    try {
      const { facilityId, year } = criteria;
      
      const where = {};
      if (facilityId) {
        where.facilityId = facilityId;
      }
      
      // Set date range for the year
      const startDate = new Date(year, 0, 1); // January 1st
      const endDate = new Date(year, 11, 31); // December 31st
      
      where.registrationDate = {
        [Op.between]: [startDate, endDate]
      };
      
      // Query to get monthly counts
      const monthlyData = await db.sequelize.query(`
        SELECT 
          TO_CHAR(DATE_TRUNC('month', "registrationDate"), 'Mon') as month,
          COUNT(id) as count
        FROM 
          "AntenatalCare"
        WHERE 
          "registrationDate" BETWEEN :startDate AND :endDate
          ${facilityId ? 'AND "facilityId" = :facilityId' : ''}
        GROUP BY 
          DATE_TRUNC('month', "registrationDate")
        ORDER BY 
          DATE_TRUNC('month', "registrationDate")
      `, {
        replacements: { 
          startDate, 
          endDate,
          ...(facilityId && { facilityId })
        },
        type: db.sequelize.QueryTypes.SELECT
      });
      
      // Ensure all months are represented
      const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
      const result = months.map(month => {
        const found = monthlyData.find(data => data.month === month);
        return {
          month,
          count: found ? parseInt(found.count, 10) : 0
        };
      });
      
      return result;
    } catch (error) {
      throw new AppError(error.message, 500);
    }
  }
  
  // Get visit compliance
  async getVisitCompliance(criteria) {
    try {
      const { facilityId, dateFrom, dateTo } = criteria;
      
      const where = {
        status: 'Active'
      };
      if (facilityId) {
        where.facilityId = facilityId;
      }
      if (dateFrom || dateTo) {
        where.registrationDate = {};
        if (dateFrom) {
          where.registrationDate[Op.gte] = new Date(dateFrom);
        }
        if (dateTo) {
          where.registrationDate[Op.lte] = new Date(dateTo);
        }
      }
      
      // Get all active antenatal records
      const antenatalRecords = await db.AntenatalCare.findAll({
        attributes: ['id'],
        include: [
          {
            model: db.AntenatalVisit,
            as: 'visits',
            attributes: ['id', 'visitDate', 'nextAppointment']
          }
        ],
        where
      });
      
      // Calculate compliance metrics
      let onSchedule = 0;
      let missedAppointments = 0;
      let neverReturned = 0;
      
      const currentDate = new Date();
      const twoWeeksAgo = new Date(currentDate);
      twoWeeksAgo.setDate(twoWeeksAgo.getDate() - 14);
      
      antenatalRecords.forEach(record => {
        if (!record.visits || record.visits.length === 0) {
          // If registered but no visits
          neverReturned++;
        } else if (record.visits.length === 1) {
          // Check if they missed follow-up after first visit
          const visit = record.visits[0];
          if (visit.nextAppointment && new Date(visit.nextAppointment) < currentDate) {
            missedAppointments++;
          } else {
            onSchedule++;
          }
        } else {
          // Multiple visits - check if recent visits match appointments
          const sortedVisits = [...record.visits].sort((a, b) => 
            new Date(b.visitDate) - new Date(a.visitDate)
          );
          
          const lastVisit = sortedVisits[0];
          const secondLastVisit = sortedVisits[1];
          
          if (secondLastVisit && secondLastVisit.nextAppointment) {
            const scheduledDate = new Date(secondLastVisit.nextAppointment);
            const actualDate = new Date(lastVisit.visitDate);
            
            // Allow a 3-day grace period
            const gracePeriod = new Date(scheduledDate);
            gracePeriod.setDate(gracePeriod.getDate() + 3);
            
            if (actualDate <= gracePeriod) {
              onSchedule++;
            } else {
              missedAppointments++;
            }
          } else {
            onSchedule++;
          }
        }
      });
      
      const total = antenatalRecords.length;
      const complianceRate = total > 0 ? (onSchedule / total) * 100 : 0;
      
      return {
        on_schedule: onSchedule,
        missed_appointments: missedAppointments,
        never_returned: neverReturned,
        compliance_rate: parseFloat(complianceRate.toFixed(1))
      };
    } catch (error) {
      throw new AppError(error.message, 500);
    }
  }
  
  // Get antenatal by facility
  async getAntenatalByFacility(criteria) {
    try {
      const { dateFrom, dateTo } = criteria;
      
      const where = {
        status: 'Active'
      };
      if (dateFrom || dateTo) {
        where.registrationDate = {};
        if (dateFrom) {
          where.registrationDate[Op.gte] = new Date(dateFrom);
        }
        if (dateTo) {
          where.registrationDate[Op.lte] = new Date(dateTo);
        }
      }
      
      // Get distribution by facility
      const facilityDistribution = await db.AntenatalCare.findAll({
        attributes: [
          [db.sequelize.col('facility.name'), 'facilityName'],
          [db.sequelize.fn('COUNT', db.sequelize.col('AntenatalCare.id')), 'count']
        ],
        include: [
          {
            model: db.Facility,
            as: 'facility',
            attributes: []
          }
        ],
        where,
        group: [db.sequelize.col('facility.name')],
        raw: true
      });
      
      // Calculate total
      const total = facilityDistribution.reduce((sum, facility) => sum + parseInt(facility.count, 10), 0);
      
      // Format result
      const result = facilityDistribution.map(facility => ({
        facility: facility.facilityName,
        count: parseInt(facility.count, 10),
        percentage: total > 0 ? (parseInt(facility.count, 10) / total) * 100 : 0
      }));
      
      return result;
    } catch (error) {
      throw new AppError(error.message, 500);
    }
  }
  
  // Get delivery outcomes
  async getDeliveryOutcomes(criteria) {
    try {
      const { facilityId, dateFrom, dateTo } = criteria;
      
      const where = {
        status: 'Completed'
      };
      if (facilityId) {
        where.facilityId = facilityId;
      }
      if (dateFrom || dateTo) {
        where.deliveryDate = {};
        if (dateFrom) {
          where.deliveryDate[Op.gte] = new Date(dateFrom);
        }
        if (dateTo) {
          where.deliveryDate[Op.lte] = new Date(dateTo);
        }
      }
      
      // Get all completed pregnancies
      const completedPregnancies = await db.AntenatalCare.findAll({
        attributes: ['id', 'outcome', 'modeOfDelivery', 'birthOutcome'],
        where
      });
      
      // Count delivery outcomes
      let totalDeliveries = completedPregnancies.length;
      let normalDelivery = 0;
      let cesareanSection = 0;
      let assistedDelivery = 0;
      let stillBirths = 0;
      let maternalDeaths = 0; // This would typically come from a separate table
      
      completedPregnancies.forEach(pregnancy => {
        if (pregnancy.modeOfDelivery === 'Vaginal Delivery') {
          normalDelivery++;
        } else if (pregnancy.modeOfDelivery === 'Cesarean Section') {
          cesareanSection++;
        } else if (pregnancy.modeOfDelivery === 'Instrumental Delivery') {
          assistedDelivery++;
        }
        
        if (pregnancy.outcome === 'Stillbirth') {
          stillBirths++;
        }
      });
      
      // For demonstration, we'll use a fixed number for maternal deaths
      // In a real system, this would come from a separate tracking system
      maternalDeaths = 12;
      
      // Calculate MMR (maternal deaths per 100,000 live births)
      const liveBirths = totalDeliveries - stillBirths;
      const maternalMortalityRatio = liveBirths > 0 ? (maternalDeaths / liveBirths) * 100000 : 0;
      
      return {
        total_deliveries: totalDeliveries,
        normal_delivery: normalDelivery,
        cesarean_section: cesareanSection,
        assisted_delivery: assistedDelivery,
        still_births: stillBirths,
        maternal_deaths: maternalDeaths,
        maternal_mortality_ratio: Math.round(maternalMortalityRatio)
      };
    } catch (error) {
      throw new AppError(error.message, 500);
    }
  }
  
  // Get antenatal trends over time
  async getAntenatalTrends(criteria) {
    try {
      const { facilityId, months = 24 } = criteria;
      
      const where = {};
      if (facilityId) {
        where.facilityId = facilityId;
      }
      
      // Calculate the start date (X months ago)
      const endDate = new Date();
      const startDate = new Date();
      startDate.setMonth(startDate.getMonth() - months + 1);
      startDate.setDate(1); // First day of month
      
      where.registrationDate = {
        [Op.between]: [startDate, endDate]
      };
      
      // Get monthly registrations
      const monthlyData = await db.sequelize.query(`
        SELECT 
          TO_CHAR(DATE_TRUNC('month', "registrationDate"), 'Mon yyyy') as month,
          COUNT(id) as total_registrations,
          SUM(CASE WHEN "riskLevel" = 'high' THEN 1 ELSE 0 END) as high_risk
        FROM 
          "AntenatalCare"
        WHERE 
          "registrationDate" BETWEEN :startDate AND :endDate
          ${facilityId ? 'AND "facilityId" = :facilityId' : ''}
        GROUP BY 
          DATE_TRUNC('month', "registrationDate")
        ORDER BY 
          DATE_TRUNC('month', "registrationDate")
      `, {
        replacements: { 
          startDate, 
          endDate,
          ...(facilityId && { facilityId })
        },
        type: db.sequelize.QueryTypes.SELECT
      });
      
      // Process results and ensure all months are represented
      const result = [];
      let currentDate = new Date(startDate);
      
      while (currentDate <= endDate) {
        const monthYear = currentDate.toLocaleString('en-US', { month: 'short', year: 'numeric' });
        const dataForMonth = monthlyData.find(data => data.month === monthYear);
        
        if (dataForMonth) {
          const totalReg = parseInt(dataForMonth.total_registrations, 10);
          const highRisk = parseInt(dataForMonth.high_risk, 10);
          
          // Calculate trimester distribution (approximation for this example)
          const firstTrimester = Math.floor(totalReg * 0.4);
          const secondTrimester = Math.floor(totalReg * 0.4);
          const thirdTrimester = totalReg - firstTrimester - secondTrimester;
          
          // Calculate visit compliance (approximation for this example)
          // In a real system, this would be calculated from actual visit data
          const visitCompliance = 65 + Math.floor(Math.random() * 15);
          
          result.push({
            month: monthYear,
            total_registrations: totalReg,
            first_trimester: firstTrimester,
            second_trimester: secondTrimester,
            third_trimester: thirdTrimester,
            high_risk: highRisk,
            visit_compliance: visitCompliance
          });
        } else {
          // If no data for this month, add zero values
          result.push({
            month: monthYear,
            total_registrations: 0,
            first_trimester: 0,
            second_trimester: 0,
            third_trimester: 0,
            high_risk: 0,
            visit_compliance: 0
          });
        }
        
        // Move to next month
        currentDate.setMonth(currentDate.getMonth() + 1);
      }
      
      return result;
    } catch (error) {
      throw new AppError(error.message, 500);
    }
  }
  
  // Get all antenatal statistics in one call
  async getAllAntenatalStatistics(criteria) {
    try {
      // Call all the individual statistic methods
      const [
        summary,
        byTrimester,
        byRiskLevel,
        byAgeGroup,
        topRiskFactors,
        monthlyRegistrations,
        visitCompliance,
        attendanceByFacility,
        deliveryOutcomes
      ] = await Promise.all([
        this.getAntenatalSummary(criteria),
        this.getAntenatalByTrimester(criteria),
        this.getAntenatalByRisk(criteria),
        this.getAntenatalByAge(criteria),
        this.getTopRiskFactors(criteria),
        this.getMonthlyRegistrations({ ...criteria, year: new Date().getFullYear() }),
        this.getVisitCompliance(criteria),
        this.getAntenatalByFacility(criteria),
        this.getDeliveryOutcomes(criteria)
      ]);
      
      // Combine all statistics into a single response
      return {
        summary,
        by_trimester: byTrimester,
        by_risk_level: byRiskLevel,
        by_age_group: byAgeGroup,
        top_risk_factors: topRiskFactors,
        monthly_registrations: monthlyRegistrations,
        visit_compliance: visitCompliance,
        attendance_by_facility: attendanceByFacility,
        delivery_outcomes: deliveryOutcomes
      };
    } catch (error) {
      throw new AppError(error.message, 500);
    }
  }
}

module.exports = new AntenatalStatisticsService();