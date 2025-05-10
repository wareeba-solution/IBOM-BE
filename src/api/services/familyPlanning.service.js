// src/api/services/familyPlanning.service.js

const { Op } = require('sequelize');
const db = require('../../models');
const { AppError } = require('../../utils/error');

class FamilyPlanningService {
  // Family Planning Method services
  async createFamilyPlanningMethod(data, userId) {
    try {
      // Check if method with same name already exists
      const existingMethod = await db.FamilyPlanningMethod.findOne({
        where: { name: data.name }
      });

      if (existingMethod) {
        throw new AppError('Family planning method with this name already exists', 400);
      }

      // Create method
      const method = await db.FamilyPlanningMethod.create({
        ...data,
        createdBy: userId,
      });

      return method;
    } catch (error) {
      if (error instanceof AppError) {
        throw error;
      }
      throw new AppError(error.message, 500);
    }
  }

  async getFamilyPlanningMethodById(id) {
    try {
      const method = await db.FamilyPlanningMethod.findByPk(id);

      if (!method) {
        throw new AppError('Family planning method not found', 404);
      }

      return method;
    } catch (error) {
      if (error instanceof AppError) {
        throw error;
      }
      throw new AppError(error.message, 500);
    }
  }

  async updateFamilyPlanningMethod(id, data, userId) {
    try {
      const method = await db.FamilyPlanningMethod.findByPk(id);
      if (!method) {
        throw new AppError('Family planning method not found', 404);
      }

      // If name is being changed, check for duplicates
      if (data.name && data.name !== method.name) {
        const existingMethod = await db.FamilyPlanningMethod.findOne({
          where: { name: data.name }
        });

        if (existingMethod) {
          throw new AppError('Family planning method with this name already exists', 400);
        }
      }

      await method.update({
        ...data,
        updatedBy: userId,
      });

      return method;
    } catch (error) {
      if (error instanceof AppError) {
        throw error;
      }
      throw new AppError(error.message, 500);
    }
  }

  async deleteFamilyPlanningMethod(id) {
    try {
      const method = await db.FamilyPlanningMethod.findByPk(id);
      if (!method) {
        throw new AppError('Family planning method not found', 404);
      }

      // Check if there are any services using this method
      const serviceCount = await db.FamilyPlanningService.count({
        where: {
          [Op.or]: [
            { methodId: id },
            { previousMethodId: id }
          ]
        }
      });

      if (serviceCount > 0) {
        // If services exist, don't delete but deactivate
        await method.update({ isActive: false });
        return { message: 'Family planning method deactivated successfully (has associated services)' };
      }

      // If no services, delete the method
      await method.destroy();
      return { message: 'Family planning method deleted successfully' };
    } catch (error) {
      if (error instanceof AppError) {
        throw error;
      }
      throw new AppError(error.message, 500);
    }
  }

  async searchFamilyPlanningMethods(criteria) {
    try {
      // src/api/services/familyPlanning.service.js (continued)

      const {
        name,
        category,
        isActive,
        page,
        limit,
        sortBy,
        sortOrder,
      } = criteria;

      const where = {};
      
      if (name) {
        where.name = {
          [Op.iLike]: `%${name}%`
        };
      }
      
      if (category) {
        where.category = category;
      }
      
      if (isActive !== undefined) {
        where.isActive = isActive;
      }

      const offset = (page - 1) * limit;
      
      const { count, rows } = await db.FamilyPlanningMethod.findAndCountAll({
        where,
        order: [[sortBy, sortOrder]],
        limit,
        offset,
      });

      const totalPages = Math.ceil(count / limit);
      
      return {
        data: rows,
        pagination: {
          totalItems: count,
          totalPages,
          currentPage: page,
          itemsPerPage: limit,
        },
      };
    } catch (error) {
      throw new AppError(error.message, 500);
    }
  }

  // Family Planning Client services
  async createFamilyPlanningClient(data, userId) {
    try {
      // Check if patient exists
      const patient = await db.Patient.findByPk(data.patientId);
      if (!patient) {
        throw new AppError('Patient not found', 404);
      }

      // Check if facility exists
      const facility = await db.Facility.findByPk(data.facilityId);
      if (!facility) {
        throw new AppError('Facility not found', 404);
      }

      // Check if patient already has an active family planning client record
      const existingActiveClient = await db.FamilyPlanningClient.findOne({
        where: {
          patientId: data.patientId,
          status: 'Active',
        },
      });

      if (existingActiveClient) {
        throw new AppError('Patient already has an active family planning client record', 400);
      }

      // Create family planning client
      const client = await db.FamilyPlanningClient.create({
        ...data,
        createdBy: userId,
      });

      return client;
    } catch (error) {
      if (error instanceof AppError) {
        throw error;
      }
      throw new AppError(error.message, 500);
    }
  }

  async getFamilyPlanningClientById(id, includeServices = false) {
    try {
      const include = [
        {
          model: db.Patient,
          as: 'patient',
          attributes: ['id', 'firstName', 'lastName', 'gender', 'dateOfBirth', 'phoneNumber'],
        },
        {
          model: db.Facility,
          as: 'facility',
          attributes: ['id', 'name', 'type', 'lga'],
        },
      ];

      if (includeServices) {
        include.push({
          model: db.FamilyPlanningService,
          as: 'services',
          include: [
            {
              model: db.FamilyPlanningMethod,
              as: 'method',
            },
            {
              model: db.FamilyPlanningMethod,
              as: 'previousMethod',
            },
          ],
          order: [['serviceDate', 'DESC']],
        });
      }

      const client = await db.FamilyPlanningClient.findByPk(id, { include });

      if (!client) {
        throw new AppError('Family planning client not found', 404);
      }

      return client;
    } catch (error) {
      if (error instanceof AppError) {
        throw error;
      }
      throw new AppError(error.message, 500);
    }
  }

  async updateFamilyPlanningClient(id, data, userId) {
    try {
      const client = await db.FamilyPlanningClient.findByPk(id);
      if (!client) {
        throw new AppError('Family planning client not found', 404);
      }

      await client.update({
        ...data,
        updatedBy: userId,
      });

      return client;
    } catch (error) {
      if (error instanceof AppError) {
        throw error;
      }
      throw new AppError(error.message, 500);
    }
  }

  async deleteFamilyPlanningClient(id) {
    try {
      const client = await db.FamilyPlanningClient.findByPk(id);
      if (!client) {
        throw new AppError('Family planning client not found', 404);
      }

      // Using soft delete (paranoid)
      await client.destroy();

      return { message: 'Family planning client record deleted successfully' };
    } catch (error) {
      if (error instanceof AppError) {
        throw error;
      }
      throw new AppError(error.message, 500);
    }
  }

  async searchFamilyPlanningClients(criteria) {
    try {
      const {
        patientId,
        facilityId,
        clientType,
        registrationDateFrom,
        registrationDateTo,
        maritalStatus,
        status,
        page,
        limit,
        sortBy,
        sortOrder,
      } = criteria;

      const where = {};
      
      if (patientId) {
        where.patientId = patientId;
      }
      
      if (facilityId) {
        where.facilityId = facilityId;
      }
      
      if (clientType) {
        where.clientType = clientType;
      }
      
      if (registrationDateFrom || registrationDateTo) {
        where.registrationDate = {};
        if (registrationDateFrom) {
          where.registrationDate[Op.gte] = new Date(registrationDateFrom);
        }
        if (registrationDateTo) {
          where.registrationDate[Op.lte] = new Date(registrationDateTo);
        }
      }
      
      if (maritalStatus) {
        where.maritalStatus = maritalStatus;
      }
      
      if (status) {
        where.status = status;
      }

      const offset = (page - 1) * limit;
      
      const { count, rows } = await db.FamilyPlanningClient.findAndCountAll({
        where,
        include: [
          {
            model: db.Patient,
            as: 'patient',
            attributes: ['id', 'firstName', 'lastName', 'gender', 'dateOfBirth', 'phoneNumber'],
          },
          {
            model: db.Facility,
            as: 'facility',
            attributes: ['id', 'name', 'type', 'lga'],
          },
        ],
        order: [[sortBy, sortOrder]],
        limit,
        offset,
      });

      const totalPages = Math.ceil(count / limit);
      
      return {
        data: rows,
        pagination: {
          totalItems: count,
          totalPages,
          currentPage: page,
          itemsPerPage: limit,
        },
      };
    } catch (error) {
      throw new AppError(error.message, 500);
    }
  }

  // Family Planning Service records
  async createFamilyPlanningService(data, userId) {
    try {
      // Check if client exists
      const client = await db.FamilyPlanningClient.findByPk(data.clientId);
      if (!client) {
        throw new AppError('Family planning client not found', 404);
      }

      // Check if client is active
      if (client.status !== 'Active') {
        throw new AppError('Cannot add services to a non-active client record', 400);
      }

      // Check if method exists and is active
      const method = await db.FamilyPlanningMethod.findByPk(data.methodId);
      if (!method) {
        throw new AppError('Family planning method not found', 404);
      }

      if (!method.isActive) {
        throw new AppError('Family planning method is inactive', 400);
      }

      // If previousMethodId is provided, check if it exists
      if (data.previousMethodId) {
        const previousMethod = await db.FamilyPlanningMethod.findByPk(data.previousMethodId);
        if (!previousMethod) {
          throw new AppError('Previous family planning method not found', 404);
        }
      }

      // Validate service type logic
      if (data.serviceType === 'Method Switch' && !data.previousMethodId) {
        throw new AppError('Previous method ID is required for method switch', 400);
      }

      if (data.serviceType === 'Initial Adoption') {
        // Check if client already has a service record
        const existingService = await db.FamilyPlanningService.findOne({
          where: { clientId: data.clientId }
        });

        if (existingService) {
          throw new AppError('Cannot use Initial Adoption for a client who already has service records', 400);
        }
      }

      // Create service record
      const service = await db.FamilyPlanningService.create({
        ...data,
        createdBy: userId,
      });

      return service;
    } catch (error) {
      if (error instanceof AppError) {
        throw error;
      }
      throw new AppError(error.message, 500);
    }
  }

  async getFamilyPlanningServiceById(id) {
    try {
      const service = await db.FamilyPlanningService.findByPk(id, {
        include: [
          {
            model: db.FamilyPlanningClient,
            as: 'client',
            include: [
              {
                model: db.Patient,
                as: 'patient',
                attributes: ['id', 'firstName', 'lastName', 'gender', 'dateOfBirth'],
              },
            ],
          },
          {
            model: db.FamilyPlanningMethod,
            as: 'method',
          },
          {
            model: db.FamilyPlanningMethod,
            as: 'previousMethod',
          },
        ],
      });

      if (!service) {
        throw new AppError('Family planning service record not found', 404);
      }

      return service;
    } catch (error) {
      if (error instanceof AppError) {
        throw error;
      }
      throw new AppError(error.message, 500);
    }
  }

  async updateFamilyPlanningService(id, data, userId) {
    try {
      const service = await db.FamilyPlanningService.findByPk(id, {
        include: [
          {
            model: db.FamilyPlanningClient,
            as: 'client',
          },
        ],
      });

      if (!service) {
        throw new AppError('Family planning service record not found', 404);
      }

      // Check if client is active
      if (service.client.status !== 'Active') {
        throw new AppError('Cannot update services for a non-active client', 400);
      }

      // If method is being changed, check if the new method exists and is active
      if (data.methodId && data.methodId !== service.methodId) {
        const method = await db.FamilyPlanningMethod.findByPk(data.methodId);
        if (!method) {
          throw new AppError('Family planning method not found', 404);
        }

        if (!method.isActive) {
          throw new AppError('Family planning method is inactive', 400);
        }
      }

      // If previousMethodId is being changed, check if it exists
      if (data.previousMethodId && data.previousMethodId !== service.previousMethodId) {
        const previousMethod = await db.FamilyPlanningMethod.findByPk(data.previousMethodId);
        if (!previousMethod) {
          throw new AppError('Previous family planning method not found', 404);
        }
      }

      await service.update({
        ...data,
        updatedBy: userId,
      });

      return service;
    } catch (error) {
      if (error instanceof AppError) {
        throw error;
      }
      throw new AppError(error.message, 500);
    }
  }

  async deleteFamilyPlanningService(id) {
    try {
      const service = await db.FamilyPlanningService.findByPk(id, {
        include: [
          {
            model: db.FamilyPlanningClient,
            as: 'client',
          },
        ],
      });

      if (!service) {
        throw new AppError('Family planning service record not found', 404);
      }

      // Check if client is active
      if (service.client.status !== 'Active') {
        throw new AppError('Cannot delete services for a non-active client', 400);
      }

      // Using soft delete (paranoid)
      await service.destroy();

      return { message: 'Family planning service record deleted successfully' };
    } catch (error) {
      if (error instanceof AppError) {
        throw error;
      }
      throw new AppError(error.message, 500);
    }
  }

  async searchFamilyPlanningServices(criteria) {
    try {
      const {
        clientId,
        methodId,
        serviceDateFrom,
        serviceDateTo,
        serviceType,
        patientSatisfaction,
        nextAppointmentFrom,
        nextAppointmentTo,
        page,
        limit,
        sortBy,
        sortOrder,
      } = criteria;

      const where = {};
      
      if (clientId) {
        where.clientId = clientId;
      }
      
      if (methodId) {
        where.methodId = methodId;
      }
      
      if (serviceDateFrom || serviceDateTo) {
        where.serviceDate = {};
        if (serviceDateFrom) {
          where.serviceDate[Op.gte] = new Date(serviceDateFrom);
        }
        if (serviceDateTo) {
          where.serviceDate[Op.lte] = new Date(serviceDateTo);
        }
      }
      
      if (serviceType) {
        where.serviceType = serviceType;
      }
      
      if (patientSatisfaction) {
        where.patientSatisfaction = patientSatisfaction;
      }
      
      if (nextAppointmentFrom || nextAppointmentTo) {
        where.nextAppointment = {};
        if (nextAppointmentFrom) {
          where.nextAppointment[Op.gte] = new Date(nextAppointmentFrom);
        }
        if (nextAppointmentTo) {
          where.nextAppointment[Op.lte] = new Date(nextAppointmentTo);
        }
      }

      const offset = (page - 1) * limit;
      
      const { count, rows } = await db.FamilyPlanningService.findAndCountAll({
        where,
        include: [
          {
            model: db.FamilyPlanningClient,
            as: 'client',
            include: [
              {
                model: db.Patient,
                as: 'patient',
                attributes: ['id', 'firstName', 'lastName', 'gender', 'dateOfBirth'],
              },
            ],
          },
          {
            model: db.FamilyPlanningMethod,
            as: 'method',
          },
          {
            model: db.FamilyPlanningMethod,
            as: 'previousMethod',
          },
        ],
        order: [[sortBy, sortOrder]],
        limit,
        offset,
      });

      const totalPages = Math.ceil(count / limit);
      
      return {
        data: rows,
        pagination: {
          totalItems: count,
          totalPages,
          currentPage: page,
          itemsPerPage: limit,
        },
      };
    } catch (error) {
      throw new AppError(error.message, 500);
    }
  }

  // Family Planning Statistics and Reports
  async getFamilyPlanningStatistics(criteria) {
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
      let joinCondition = null;
      
      // Configure grouping based on parameter
      switch (groupBy) {
        case 'method':
          attributes = [
            [db.sequelize.col('services.method.name'), 'methodName'],
            [db.sequelize.fn('COUNT', db.sequelize.col('services.id')), 'count'],
          ];
          group = [db.sequelize.col('services.method.name')];
          break;
        case 'clientType':
          attributes = [
            'clientType',
            [db.sequelize.fn('COUNT', db.sequelize.col('id')), 'count'],
          ];
          group = ['clientType'];
          break;
        case 'facility':
          attributes = [
            [db.sequelize.col('facility.name'), 'facilityName'],
            [db.sequelize.fn('COUNT', db.sequelize.col('FamilyPlanningClient.id')), 'count'],
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
        case 'maritalStatus':
          attributes = [
            'maritalStatus',
            [db.sequelize.fn('COUNT', db.sequelize.col('id')), 'count'],
          ];
          group = ['maritalStatus'];
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
            [db.sequelize.fn('COUNT', db.sequelize.col('FamilyPlanningClient.id')), 'count'],
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
        case 'serviceType':
          attributes = [
            [db.sequelize.col('services.serviceType'), 'serviceType'],
            [db.sequelize.fn('COUNT', db.sequelize.col('services.id')), 'count'],
          ];
          group = [db.sequelize.col('services.serviceType')];
          break;
        default:
          throw new AppError('Invalid groupBy parameter', 400);
      }

      let results;

      if (groupBy === 'method' || groupBy === 'serviceType') {
        // These groups need to join with the services table
        results = await db.FamilyPlanningClient.findAll({
          attributes,
          include: [
            {
              model: db.FamilyPlanningService,
              as: 'services',
              required: true,
              attributes: [],
              include: [
                {
                  model: db.FamilyPlanningMethod,
                  as: 'method',
                  attributes: [],
                },
              ],
            },
          ],
          where,
          group,
          raw: true,
        });
      } else {
        // Other groups don't need the services table
        results = await db.FamilyPlanningClient.findAll({
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
              groupBy === 'method' ? 
                [[db.sequelize.literal('methodName'), 'ASC']] : 
                groupBy === 'facility' ? 
                  [[db.sequelize.literal('facilityName'), 'ASC']] : 
                  groupBy === 'serviceType' ? 
                    [[db.sequelize.literal('serviceType'), 'ASC']] : 
                    [[groupBy, 'ASC']],
        });
      }

      return results;
    } catch (error) {
      if (error instanceof AppError) {
        throw error;
      }
      throw new AppError(error.message, 500);
    }
  }

  async getDueAppointments(criteria) {
    try {
      const { 
        facilityId, 
        dateFrom, 
        dateTo,
        page,
        limit 
      } = criteria;

      // Create where clause for dates
      const whereService = {
        nextAppointment: {
          [Op.ne]: null,
        }
      };
      
      if (dateFrom || dateTo) {
        whereService.nextAppointment = {
          ...whereService.nextAppointment,
        };
        if (dateFrom) {
          whereService.nextAppointment[Op.gte] = new Date(dateFrom);
        }
        if (dateTo) {
          whereService.nextAppointment[Op.lte] = new Date(dateTo);
        }
      }

      // Create where clause for facility
      const whereClient = {};
      if (facilityId) {
        whereClient.facilityId = facilityId;
      }
      whereClient.status = 'Active';

      const offset = (page - 1) * limit;
      
      // Subquery to get the latest service for each client
      const latestServicesSubquery = db.sequelize.literal(`
        (SELECT "familyPlanningServiceId" FROM (
          SELECT
            fs.id as "familyPlanningServiceId",
            fs."clientId",
            ROW_NUMBER() OVER (PARTITION BY fs."clientId" ORDER BY fs."serviceDate" DESC) as rn
          FROM family_planning_services fs
          WHERE fs."nextAppointment" IS NOT NULL
        ) ranked WHERE rn = 1)
      `);

      const { count, rows } = await db.FamilyPlanningService.findAndCountAll({
        where: {
          ...whereService,
          id: {
            [Op.in]: latestServicesSubquery
          }
        },
        include: [
          {
            model: db.FamilyPlanningClient,
            as: 'client',
            where: whereClient,
            include: [
              {
                model: db.Patient,
                as: 'patient',
                attributes: ['id', 'firstName', 'lastName', 'gender', 'dateOfBirth', 'phoneNumber'],
              },
              {
                model: db.Facility,
                as: 'facility',
                attributes: ['id', 'name', 'type', 'lga'],
              },
            ],
          },
          {
            model: db.FamilyPlanningMethod,
            as: 'method',
          },
        ],
        order: [['nextAppointment', 'ASC']],
        limit,
        offset,
      });

      const totalPages = Math.ceil(count / limit);
      
      return {
        data: rows,
        pagination: {
          totalItems: count,
          totalPages,
          currentPage: page,
          itemsPerPage: limit,
        },
      };
    } catch (error) {
      throw new AppError(error.message, 500);
    }
  }

  async getMethodDistribution() {
    try {
      // Get the latest method used by each active client
      const query = `
        WITH LatestMethods AS (
          SELECT DISTINCT ON (fs."clientId") 
            fs."methodId",
            fs."clientId"
          FROM family_planning_services fs
          JOIN family_planning_clients fc ON fs."clientId" = fc.id
          WHERE fc.status = 'Active'
          ORDER BY fs."clientId", fs."serviceDate" DESC
        )
        SELECT 
          m.name AS "methodName",
          m.category AS "methodCategory",
          COUNT(lm."clientId") AS "count"
        FROM LatestMethods lm
        JOIN family_planning_methods m ON lm."methodId" = m.id
        GROUP BY m.name, m.category
        ORDER BY "count" DESC
      `;

      const results = await db.sequelize.query(query, { 
        type: db.sequelize.QueryTypes.SELECT 
      });

      return results;
    } catch (error) {
      throw new AppError(error.message, 500);
    }
  }

  async getClientRetentionStats(criteria) {
    try {
      const { facilityId, yearFrom, yearTo } = criteria;

      const whereClause = facilityId ? `WHERE fc."facilityId" = '${facilityId}'` : '';
      const yearFilter = yearFrom && yearTo ? 
        `AND EXTRACT(YEAR FROM fc."registrationDate") BETWEEN ${yearFrom} AND ${yearTo}` : 
        yearFrom ? 
          `AND EXTRACT(YEAR FROM fc."registrationDate") >= ${yearFrom}` : 
          yearTo ? 
            `AND EXTRACT(YEAR FROM fc."registrationDate") <= ${yearTo}` : 
            '';

      const query = `
        WITH RegisteredClients AS (
          SELECT 
            EXTRACT(YEAR FROM fc."registrationDate") AS year,
            COUNT(fc.id) AS total_registered
          FROM family_planning_clients fc
          ${whereClause}
          ${yearFilter}
          GROUP BY EXTRACT(YEAR FROM fc."registrationDate")
        ),
        ActiveClients AS (
          SELECT 
            EXTRACT(YEAR FROM fc."registrationDate") AS year,
            COUNT(fc.id) AS still_active
          FROM family_planning_clients fc
          ${whereClause}
          ${yearFilter}
          WHERE fc.status = 'Active'
          GROUP BY EXTRACT(YEAR FROM fc."registrationDate")
        )
        SELECT 
          rc.year,
          rc.total_registered,
          COALESCE(ac.still_active, 0) AS still_active,
          ROUND((COALESCE(ac.still_active, 0)::float / rc.total_registered::float) * 100, 2) AS retention_rate
        FROM RegisteredClients rc
        LEFT JOIN ActiveClients ac ON rc.year = ac.year
        ORDER BY rc.year
      `;

      const results = await db.sequelize.query(query, { 
        type: db.sequelize.QueryTypes.SELECT 
      });

      return results;
    } catch (error) {
      throw new AppError(error.message, 500);
    }
  }
}

module.exports = new FamilyPlanningService();