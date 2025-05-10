// src/api/services/faq.service.js
const { FAQ, User, sequelize } = require('../../models');
const { Op } = require('sequelize');
const AppError = require('../../utils/appError');

class FAQService {
  async createFAQ(faqData, userId) {
    try {
      const faq = await FAQ.create({
        ...faqData,
        createdBy: userId,
        lastModifiedBy: userId
      });
      
      return faq;
    } catch (error) {
      throw new AppError(`Failed to create FAQ: ${error.message}`, 500);
    }
  }

  async getFAQById(id) {
    const faq = await FAQ.findByPk(id, {
      include: [
        {
          model: User,
          as: 'creator',
          attributes: ['id', 'firstName', 'lastName', 'email']
        },
        {
          model: User,
          as: 'modifier',
          attributes: ['id', 'firstName', 'lastName', 'email']
        }
      ]
    });

    if (!faq) {
      throw new AppError('FAQ not found', 404);
    }

    return faq;
  }

  async updateFAQ(id, updateData, userId) {
    const faq = await this.getFAQById(id);
    
    await faq.update({
      ...updateData,
      lastModifiedBy: userId
    });
    
    return faq;
  }

  async deleteFAQ(id, userId) {
    const faq = await this.getFAQById(id);
    
    await faq.destroy();
    
    return { success: true };
  }

  async searchFAQs(searchParams) {
    const { category, status, tag, query, page = 1, limit = 10 } = searchParams;
    
    const whereClause = {};
    
    if (category) {
      whereClause.category = category;
    }
    
    if (status) {
      whereClause.status = status;
    }
    
    if (tag) {
      whereClause.tags = { [Op.contains]: [tag] };
    }
    
    if (query) {
      whereClause[Op.or] = [
        { question: { [Op.iLike]: `%${query}%` } },
        { answer: { [Op.iLike]: `%${query}%` } }
      ];
    }
    
    const offset = (page - 1) * limit;
    
    const { rows, count } = await FAQ.findAndCountAll({
      where: whereClause,
      include: [
        {
          model: User,
          as: 'creator',
          attributes: ['id', 'firstName', 'lastName', 'email']
        }
      ],
      order: [
        ['category', 'ASC'],
        ['sortOrder', 'ASC'],
        ['question', 'ASC']
      ],
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

  async getFAQCategories() {
    const categories = await FAQ.findAll({
      attributes: [
        'category',
        [sequelize.fn('COUNT', sequelize.col('id')), 'count']
      ],
      where: {
        status: 'published'
      },
      group: ['category'],
      order: [['category', 'ASC']]
    });
    
    return categories;
  }

  async getFAQsByCategory(category) {
    const faqs = await FAQ.findAll({
      where: {
        category,
        status: 'published'
      },
      order: [
        ['sortOrder', 'ASC'],
        ['question', 'ASC']
      ]
    });
    
    return faqs;
  }
}

module.exports = new FAQService();