// src/api/routes/deathStatistic.routes.js

const express = require('express');
const router = express.Router();
const deathStatisticController = require('../controllers/deathStatistic.controller');
const { authenticate } = require('../middlewares/auth.middleware');
const { checkPermission } = require('../middlewares/permission.middleware');

router.post(
  '/',
  authenticate,
  checkPermission('death_statistics:create'),
  deathStatisticController.createDeathStatistic
);

router.get(
  '/:id',
  authenticate,
  checkPermission('death_statistics:read'),
  deathStatisticController.getDeathStatisticById
);

router.put(
  '/:id',
  authenticate,
  checkPermission('death_statistics:update'),
  deathStatisticController.updateDeathStatistic
);

router.delete(
  '/:id',
  authenticate,
  checkPermission('death_statistics:delete'),
  deathStatisticController.deleteDeathStatistic
);

router.get(
  '/',
  authenticate,
  checkPermission('death_statistics:read'),
  deathStatisticController.searchDeathStatistics
);

router.get(
  '/reports/statistics',
  authenticate,
  checkPermission('death_statistics:read'),
  deathStatisticController.getDeathStatisticsReport
);

module.exports = router;