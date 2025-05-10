// src/models/faq.model.js
const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  const FAQ = sequelize.define('FAQ', {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true
    },
    question: {
      type: DataTypes.STRING,
      allowNull: false
    },
    answer: {
      type: DataTypes.TEXT,
      allowNull: false
    },
    category: {
      type: DataTypes.STRING,
      allowNull: false
    },
    tags: {
      type: DataTypes.ARRAY(DataTypes.STRING),
      defaultValue: []
    },
    status: {
      type: DataTypes.ENUM('draft', 'published', 'archived'),
      defaultValue: 'draft',
      allowNull: false
    },
    sortOrder: {
      type: DataTypes.INTEGER,
      defaultValue: 0
    },
    createdBy: {
      type: DataTypes.UUID,
      allowNull: false,
      references: {
        model: 'Users',
        key: 'id'
      }
    },
    lastModifiedBy: {
      type: DataTypes.UUID,
      allowNull: true,
      references: {
        model: 'Users',
        key: 'id'
      }
    }
  }, {
    timestamps: true,
    paranoid: true,
    indexes: [
      { fields: ['category'] },
      { fields: ['status'] },
      { fields: ['tags'] }
    ]
  });

  FAQ.associate = (models) => {
    FAQ.belongsTo(models.User, { foreignKey: 'createdBy', as: 'creator' });
    FAQ.belongsTo(models.User, { foreignKey: 'lastModifiedBy', as: 'modifier' });
  };

  return FAQ;
};