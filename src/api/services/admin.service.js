// src/api/services/admin.service.js
const { User, Facility, sequelize } = require('../../models');
const { Op } = require('sequelize');
const AppError = require('../../utils/appError');

class AdminService {
  async getDashboardStats() {
    try {
      // Get user statistics
      const userStats = await User.findAll({
        attributes: [
          'role',
          [sequelize.fn('COUNT', sequelize.col('id')), 'count']
        ],
        group: ['role']
      });
      
      // Get facility statistics
      const facilityStats = await Facility.findAll({
        attributes: [
          'type',
          [sequelize.fn('COUNT', sequelize.col('id')), 'count']
        ],
        group: ['type']
      });
      
      // Get recent activity counts
      const recentActivity = await this.getRecentActivityCounts();
      
      // Get system health info
      const systemHealth = await this.getSystemHealth();
      
      return {
        users: userStats,
        facilities: facilityStats,
        recentActivity,
        systemHealth
      };
    } catch (error) {
      throw new AppError(`Failed to retrieve dashboard stats: ${error.message}`, 500);
    }
  }

  async getRecentActivityCounts() {
    const lastWeek = new Date();
    lastWeek.setDate(lastWeek.getDate() - 7);
    
    // Query multiple tables to get recent activity counts
    const queries = [
      {
        model: 'Patient',
        label: 'new_patients'
      },
      {
        model: 'Birth',
        label: 'births'
      },
      {
        model: 'Death',
        label: 'deaths'
      },
      {
        model: 'AntenatalCare',
        label: 'anc_visits'
      },
      {
        model: 'Immunization',
        label: 'immunizations'
      },
      {
        model: 'CommunicableDisease',
        label: 'disease_cases'
      }
    ];
    
    const results = {};
    
    for (const query of queries) {
      const queryStr = `
        SELECT COUNT(*) as count
        FROM "${query.model}s"
        WHERE "createdAt" >= :lastWeek
      `;
      
      const [data] = await sequelize.query(queryStr, {
        replacements: { lastWeek }
      });
      
      results[query.label] = data[0].count;
    }
    
    return results;
  }

  async getSystemHealth() {
    try {
      // Check database connection
      await sequelize.authenticate();
      const dbStatus = 'connected';
      
      // Get database size
      const [dbSizeResult] = await sequelize.query(`
        SELECT pg_size_pretty(pg_database_size(current_database())) as size
      `);
      const dbSize = dbSizeResult[0].size;
      
      // Get table row counts
      const tableCountsQuery = `
        SELECT
          relname as table_name,
          n_live_tup as row_count
        FROM
          pg_stat_user_tables
        ORDER BY
          n_live_tup DESC
      `;
      
      const [tableCounts] = await sequelize.query(tableCountsQuery);
      
      // Check disk space
      const diskSpace = {
        total: 'Unknown',
        used: 'Unknown',
        free: 'Unknown'
      };
      
      // In a real implementation, you might use a system command or library to get disk space
      
      return {
        database: {
          status: dbStatus,
          size: dbSize,
          tableCounts
        },
        disk: diskSpace,
        uptime: process.uptime() // in seconds
      };
    } catch (error) {
      return {
        database: {
          status: 'error',
          error: error.message
        }
      };
    }
  }
}

module.exports = new AdminService();