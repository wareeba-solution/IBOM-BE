// src/middleware/rateLimiter.js - In-memory version (no Redis)
const rateLimit = require('express-rate-limit');
const logger = require('../utils/logger');

// Enhanced patient limiter (to catch infinite loops) - This is the important one for your issue
const enhancedPatientLimiter = rateLimit({
    windowMs: 30 * 1000, // 30 seconds
    max: 20, // 20 requests per 30 seconds
    standardHeaders: true,
    legacyHeaders: false,
    keyGenerator: (req) => {
      const userKey = req.user?.id || req.ip;
      return `patient:${userKey}:${req.path}`;
    },
    
    handler: (req, res) => {
      logger.error('Patient rate limit exceeded - Infinite loop blocked', {
        user: req.user?.username || req.ip,
        endpoint: req.path,
        method: req.method,
        alert: 'INFINITE_LOOP_BLOCKED'
      });
      
      res.status(429).json({
        status: 'error',
        message: 'Too many patient requests detected. Possible infinite loop. Please check your frontend code.',
        retryAfter: '30 seconds',
        suggestion: 'Check useEffect dependencies in your React components'
      });
    }
  });

const generalLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 1000,
  standardHeaders: true,
  legacyHeaders: false,
  keyGenerator: (req) => req.user?.id || req.ip,
  handler: (req, res) => {
    res.status(429).json({
      status: 'error',
      message: 'Too many requests from this IP, please try again later.',
      retryAfter: '15 minutes'
    });
  }
});

const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 10,
  skipSuccessfulRequests: true,
  standardHeaders: true,
  legacyHeaders: false,
  handler: (req, res) => {
    res.status(429).json({
      status: 'error',
      message: 'Too many login attempts. Please try again after 15 minutes.',
      retryAfter: '15 minutes'
    });
  }
});

const readOnlyLimiter = rateLimit({
  windowMs: 1 * 60 * 1000,
  max: 120,
  skip: (req) => req.method !== 'GET',
  standardHeaders: true,
  legacyHeaders: false,
  handler: (req, res) => {
    res.status(429).json({
      status: 'error',
      message: 'Too many read requests, please slow down.',
      retryAfter: '1 minute'
    });
  }
});

// Write operations limiter
const writeLimiter = rateLimit({
  windowMs: 1 * 60 * 1000,
  max: 30,
  skip: (req) => req.method === 'GET',
  standardHeaders: true,
  legacyHeaders: false,
  handler: (req, res) => {
    res.status(429).json({
      status: 'error',
      message: 'Too many write operations, please slow down.',
      retryAfter: '1 minute'
    });
  }
});

// Health check limiter
const healthLimiter = rateLimit({
  windowMs: 1 * 60 * 1000,
  max: 300,
  standardHeaders: false,
  legacyHeaders: false,
});

module.exports = {
  generalLimiter,
  authLimiter,
  patientLimiter: enhancedPatientLimiter,
  readOnlyLimiter,
  writeLimiter,
  healthLimiter,
  enhancedPatientLimiter
};