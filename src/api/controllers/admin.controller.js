// src/api/controllers/admin.controller.js
const adminService = require('../services/admin.service');

exports.getDashboardStats = async (req, res, next) => {
  try {
    const stats = await adminService.getDashboardStats();
    res.status(200).json({
      status: 'success',
      data: stats
    });
  } catch (error) {
    next(error);
  }
};

exports.getSystemHealth = async (req, res, next) => {
  try {
    const health = await adminService.getSystemHealth();
    res.status(200).json({
      status: 'success',
      data: health
    });
  } catch (error) {
    next(error);
  }
};