// src/models/helpContent.model.js
const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  const HelpContent = sequelize.define('HelpContent', {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true
    },
    title: {
      type: DataTypes.STRING,
      allowNull: false
    },
    content: {
      type: DataTypes.TEXT,
      allowNull: false
    },
    slug: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true
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
      { fields: ['slug'], unique: true },
      { fields: ['status'] },
      { fields: ['tags'] }
    ]
  });

  HelpContent.associate = (models) => {
    HelpContent.belongsTo(models.User, { foreignKey: 'createdBy', as: 'creator' });
    HelpContent.belongsTo(models.User, { foreignKey: 'lastModifiedBy', as: 'modifier' });
  };

  return HelpContent;
};