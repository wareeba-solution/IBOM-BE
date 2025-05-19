// src/api/controllers/antenatal-statistics.controller.js

const antenatalStatisticsService = require('../services/antenatal-statistics.service');

class AntenatalStatisticsController {
  async getAntenatalStatistics(req, res, next) {
      try {
        const { facilityId, dateFrom, dateTo, groupBy } = req.query;
        
        if (!groupBy || !['status', 'outcome', 'hivStatus', 'facility', 'month', 'age'].includes(groupBy)) {
          return res.status(400).json({ error: 'Invalid or missing groupBy parameter' });
        }
  
        const results = await antenatalStatisticsService.getAntenatalStatistics({
          facilityId,
          dateFrom,
          dateTo,
          groupBy,
        });
  
        return res.status(200).json(results);
      } catch (error) {
        next(error);
      }
    }

  async getAntenatalSummary(req, res, next) {
    try {
      const { facilityId, dateFrom, dateTo } = req.query;
      
      const summary = await antenatalStatisticsService.getAntenatalSummary({
        facilityId,
        dateFrom,
        dateTo
      });
      
      return res.status(200).json(summary);
    } catch (error) {
      next(error);
    }
  }

  
  // Get antenatal statistics by trimester
  async getAntenatalByTrimester(req, res, next) {
    try {
      const { facilityId, dateFrom, dateTo } = req.query;
      
      const byTrimester = await antenatalStatisticsService.getAntenatalByTrimester({
        facilityId,
        dateFrom,
        dateTo
      });
      
      return res.status(200).json(byTrimester);
    } catch (error) {
      next(error);
    }
  }
  
  // Get antenatal statistics by risk level
  async getAntenatalByRisk(req, res, next) {
    try {
      const { facilityId, dateFrom, dateTo } = req.query;
      
      const byRisk = await antenatalStatisticsService.getAntenatalByRisk({
        facilityId,
        dateFrom,
        dateTo
      });
      
      return res.status(200).json(byRisk);
    } catch (error) {
      next(error);
    }
  }
  
  // Get antenatal statistics by age group
  async getAntenatalByAge(req, res, next) {
    try {
      console.log('Starting getAntenatalByAge with query:', req.query);
      
      // Create a clean params object
      const params = {
        facilityId: req.query.facilityId || undefined,
        dateFrom: req.query.dateFrom || undefined,
        dateTo: req.query.dateTo || undefined
      };
      
      console.log('Calling service with params:', params);
      
      const byAge = await antenatalStatisticsService.getAntenatalByAge(params);
      
      return res.status(200).json(byAge);
    } catch (error) {
      console.error('Error in getAntenatalByAge:', error);
      next(error);
    }
  }
  
  // Get top risk factors
  async getTopRiskFactors(req, res, next) {
    try {
      const { facilityId, dateFrom, dateTo, limit: limitParam } = req.query;
      const limit = limitParam ? parseInt(limitParam, 10) : 5;
      
      const topRiskFactors = await antenatalStatisticsService.getTopRiskFactors({
        facilityId,
        dateFrom,
        dateTo,
        limit
      });
      
      return res.status(200).json(topRiskFactors);
    } catch (error) {
      next(error);
    }
  }
  
  // Get monthly registrations
  async getMonthlyRegistrations(req, res, next) {
    try {
      const facilityId = req.query.facilityId;
      const yearParam = req.query.year;
      const year = yearParam ? parseInt(yearParam, 10) : new Date().getFullYear();
      
      const monthlyRegistrations = await antenatalStatisticsService.getMonthlyRegistrations({
        facilityId,
        year
      });
      
      return res.status(200).json(monthlyRegistrations);
    } catch (error) {
      next(error);
    }
  }
  
  // Get visit compliance
  async getVisitCompliance(req, res, next) {
    try {
      const { facilityId, dateFrom, dateTo } = req.query;
      
      const visitCompliance = await antenatalStatisticsService.getVisitCompliance({
        facilityId,
        dateFrom,
        dateTo
      });
      
      return res.status(200).json(visitCompliance);
    } catch (error) {
      next(error);
    }
  }
  
  // Get antenatal by facility
  async getAntenatalByFacility(req, res, next) {
    try {
      const { dateFrom, dateTo } = req.query;
      
      const byFacility = await antenatalStatisticsService.getAntenatalByFacility({
        dateFrom,
        dateTo
      });
      
      return res.status(200).json(byFacility);
    } catch (error) {
      next(error);
    }
  }
  
  // Get delivery outcomes
  async getDeliveryOutcomes(req, res, next) {
    try {
      const { facilityId, dateFrom, dateTo } = req.query;
      
      const deliveryOutcomes = await antenatalStatisticsService.getDeliveryOutcomes({
        facilityId,
        dateFrom,
        dateTo
      });
      
      return res.status(200).json(deliveryOutcomes);
    } catch (error) {
      next(error);
    }
  }
  
  // Get antenatal trends over time
  async getAntenatalTrends(req, res, next) {
    try {
      const { facilityId, months } = req.query;
      
      const trends = await antenatalStatisticsService.getAntenatalTrends({
        facilityId,
        months: months ? parseInt(months, 10) : 24
      });
      
      return res.status(200).json(trends);
    } catch (error) {
      next(error);
    }
  }
  
  // Get all antenatal statistics in one call
  async getAllAntenatalStatistics(req, res, next) {
    try {
      console.log('Starting getAllAntenatalStatistics with query:', req.query);
      
      // Extracting query parameters
      const { facilityId, dateFrom, dateTo } = req.query;
      
      // Create a clean params object
      const params = {
        facilityId: facilityId || undefined,
        dateFrom: dateFrom || undefined,
        dateTo: dateTo || undefined
      };
      
      console.log('Calling service with params:', params);
      
      // Call the service with the cleaned parameters
      const allStats = await antenatalStatisticsService.getAllAntenatalStatistics(params);
      
      return res.status(200).json(allStats);
    } catch (error) {
      console.error('Error in getAllAntenatalStatistics:', error);
      next(error);
    }
  }

}



module.exports = new AntenatalStatisticsController();