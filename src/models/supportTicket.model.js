// src/models/supportTicket.model.js
const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  const SupportTicket = sequelize.define('SupportTicket', {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true
    },
    ticketNumber: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true
    },
    subject: {
      type: DataTypes.STRING,
      allowNull: false
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: false
    },
    status: {
      type: DataTypes.ENUM('open', 'in_progress', 'on_hold', 'resolved', 'closed'),
      defaultValue: 'open',
      allowNull: false
    },
    priority: {
      type: DataTypes.ENUM('low', 'medium', 'high', 'urgent'),
      defaultValue: 'medium',
      allowNull: false
    },
    category: {
      type: DataTypes.STRING,
      allowNull: false
    },
    assignedTo: {
      type: DataTypes.UUID,
      allowNull: true,
      references: {
        model: 'Users',
        key: 'id'
      }
    },
    createdBy: {
      type: DataTypes.UUID,
      allowNull: false,
      references: {
        model: 'Users',
        key: 'id'
      }
    },
    resolvedAt: {
      type: DataTypes.DATE,
      allowNull: true
    },
    closedAt: {
      type: DataTypes.DATE,
      allowNull: true
    },
    dueDate: {
      type: DataTypes.DATE,
      allowNull: true
    },
    attachments: {
      type: DataTypes.JSONB,
      defaultValue: []
    }
  }, {
    timestamps: true,
    indexes: [
      { fields: ['ticketNumber'], unique: true },
      { fields: ['status'] },
      { fields: ['priority'] },
      { fields: ['category'] },
      { fields: ['assignedTo'] },
      { fields: ['createdBy'] }
    ]
  });

  SupportTicket.associate = (models) => {
    SupportTicket.belongsTo(models.User, { foreignKey: 'createdBy', as: 'creator' });
    SupportTicket.belongsTo(models.User, { foreignKey: 'assignedTo', as: 'assignee' });
    SupportTicket.hasMany(models.TicketComment, { foreignKey: 'ticketId', as: 'comments' });
  };

  return SupportTicket;
};