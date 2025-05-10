// src/api/services/support.service.js
const { SupportTicket, TicketComment, User, sequelize } = require('../../models');
const { Op } = require('sequelize');
const AppError = require('../../utils/appError');
const { v4: uuidv4 } = require('uuid');

class SupportService {
  async createTicket(ticketData, userId) {
    try {
      // Generate a unique ticket number
      const ticketNumber = await this.generateTicketNumber();
      
      const ticket = await SupportTicket.create({
        ...ticketData,
        ticketNumber,
        createdBy: userId
      });
      
      // Notify admins or support staff about new ticket
      // This would be implemented with a notification service
      
      return ticket;
    } catch (error) {
      throw new AppError(`Failed to create support ticket: ${error.message}`, 500);
    }
  }

  async generateTicketNumber() {
    // Generate a ticket number with format: YYYY-MM-PREFIX-XXXX
    const date = new Date();
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const prefix = 'T';
    
    // Get the latest ticket number to increment
    const latestTicket = await SupportTicket.findOne({
      where: {
        ticketNumber: {
          [Op.like]: `${year}-${month}-${prefix}-%`
        }
      },
      order: [['createdAt', 'DESC']]
    });
    
    let sequence = 1;
    if (latestTicket) {
      const parts = latestTicket.ticketNumber.split('-');
      sequence = parseInt(parts[3], 10) + 1;
    }
    
    return `${year}-${month}-${prefix}-${String(sequence).padStart(4, '0')}`;
  }

  async getTicketById(id) {
    const ticket = await SupportTicket.findByPk(id, {
      include: [
        {
          model: User,
          as: 'creator',
          attributes: ['id', 'firstName', 'lastName', 'email']
        },
        {
          model: User,
          as: 'assignee',
          attributes: ['id', 'firstName', 'lastName', 'email']
        },
        {
          model: TicketComment,
          as: 'comments',
          include: [
            {
              model: User,
              as: 'creator',
              attributes: ['id', 'firstName', 'lastName', 'email']
            }
          ]
        }
      ]
    });

    if (!ticket) {
      throw new AppError('Support ticket not found', 404);
    }

    return ticket;
  }

  async getTicketByNumber(ticketNumber) {
    const ticket = await SupportTicket.findOne({
      where: { ticketNumber },
      include: [
        {
          model: User,
          as: 'creator',
          attributes: ['id', 'firstName', 'lastName', 'email']
        },
        {
          model: User,
          as: 'assignee',
          attributes: ['id', 'firstName', 'lastName', 'email']
        },
        {
          model: TicketComment,
          as: 'comments',
          include: [
            {
              model: User,
              as: 'creator',
              attributes: ['id', 'firstName', 'lastName', 'email']
            }
          ]
        }
      ]
    });

    if (!ticket) {
      throw new AppError(`Support ticket with number '${ticketNumber}' not found`, 404);
    }

    return ticket;
  }

  async updateTicket(id, updateData, userId) {
    const ticket = await this.getTicketById(id);
    
    // Keep track of status changes
    const oldStatus = ticket.status;
    const newStatus = updateData.status || oldStatus;
    
    // Update timestamp fields based on status changes
    if (oldStatus !== 'resolved' && newStatus === 'resolved') {
      updateData.resolvedAt = new Date();
    }
    
    if (oldStatus !== 'closed' && newStatus === 'closed') {
      updateData.closedAt = new Date();
    }
    
    await ticket.update(updateData);
    
    // Log the update as an internal comment
    if (oldStatus !== newStatus) {
      await this.addComment({
        ticketId: id,
        content: `Ticket status changed from ${oldStatus} to ${newStatus}`,
        isInternal: true
      }, userId);
    }
    
    return ticket;
  }

  async searchTickets(searchParams) {
    const { 
      status, 
      priority, 
      category, 
      assignedTo, 
      createdBy, 
      query,
      fromDate,
      toDate,
      page = 1,
      limit = 10
    } = searchParams;
    
    const whereClause = {};
    
    if (status) {
      whereClause.status = status;
    }
    
    if (priority) {
      whereClause.priority = priority;
    }
    
    if (category) {
      whereClause.category = category;
    }
    
    if (assignedTo) {
      whereClause.assignedTo = assignedTo;
    }
    
    if (createdBy) {
      whereClause.createdBy = createdBy;
    }
    
    if (query) {
      whereClause[Op.or] = [
        { subject: { [Op.iLike]: `%${query}%` } },
        { description: { [Op.iLike]: `%${query}%` } },
        { ticketNumber: { [Op.iLike]: `%${query}%` } }
      ];
    }
    
    if (fromDate || toDate) {
      whereClause.createdAt = {};
      
      if (fromDate) {
        whereClause.createdAt[Op.gte] = new Date(fromDate);
      }
      
      if (toDate) {
        whereClause.createdAt[Op.lte] = new Date(toDate);
      }
    }
    
    const offset = (page - 1) * limit;
    
    // src/api/services/support.service.js (continued)
    const { rows, count } = await SupportTicket.findAndCountAll({
        where: whereClause,
        include: [
          {
            model: User,
            as: 'creator',
            attributes: ['id', 'firstName', 'lastName', 'email']
          },
          {
            model: User,
            as: 'assignee',
            attributes: ['id', 'firstName', 'lastName', 'email']
          }
        ],
        order: [['updatedAt', 'DESC']],
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
  
    async addComment(commentData, userId) {
      try {
        // Ensure ticket exists
        await this.getTicketById(commentData.ticketId);
        
        const comment = await TicketComment.create({
          ...commentData,
          createdBy: userId
        });
        
        // If it's not an internal comment, update the ticket's updatedAt timestamp
        if (!commentData.isInternal) {
          await SupportTicket.update(
            { updatedAt: new Date() },
            { where: { id: commentData.ticketId } }
          );
        }
        
        // Load comment with user info
        const commentWithUser = await TicketComment.findByPk(comment.id, {
          include: [
            {
              model: User,
              as: 'creator',
              attributes: ['id', 'firstName', 'lastName', 'email']
            }
          ]
        });
        
        return commentWithUser;
      } catch (error) {
        throw new AppError(`Failed to add comment: ${error.message}`, 500);
      }
    }
  
    async getTicketComments(ticketId, includeInternal = false) {
      // Ensure ticket exists
      await this.getTicketById(ticketId);
      
      const whereClause = { ticketId };
      
      if (!includeInternal) {
        whereClause.isInternal = false;
      }
      
      const comments = await TicketComment.findAll({
        where: whereClause,
        include: [
          {
            model: User,
            as: 'creator',
            attributes: ['id', 'firstName', 'lastName', 'email']
          }
        ],
        order: [['createdAt', 'ASC']]
      });
      
      return comments;
    }
  
    async getTicketStatistics(userId = null) {
      const whereClause = {};
      
      if (userId) {
        whereClause[Op.or] = [
          { assignedTo: userId },
          { createdBy: userId }
        ];
      }
      
      // Get counts by status
      const statusCounts = await SupportTicket.findAll({
        attributes: [
          'status',
          [sequelize.fn('COUNT', sequelize.col('id')), 'count']
        ],
        where: whereClause,
        group: ['status']
      });
      
      // Get counts by priority
      const priorityCounts = await SupportTicket.findAll({
        attributes: [
          'priority',
          [sequelize.fn('COUNT', sequelize.col('id')), 'count']
        ],
        where: whereClause,
        group: ['priority']
      });
      
      // Get counts by category
      const categoryCounts = await SupportTicket.findAll({
        attributes: [
          'category',
          [sequelize.fn('COUNT', sequelize.col('id')), 'count']
        ],
        where: whereClause,
        group: ['category']
      });
      
      // Get overdue tickets count
      const overdueCount = await SupportTicket.count({
        where: {
          ...whereClause,
          dueDate: {
            [Op.lt]: new Date()
          },
          status: {
            [Op.notIn]: ['resolved', 'closed']
          }
        }
      });
      
      return {
        statusCounts,
        priorityCounts,
        categoryCounts,
        overdueCount
      };
    }
  }
  
  module.exports = new SupportService();