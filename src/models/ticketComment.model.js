// src/models/ticketComment.model.js
const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  const TicketComment = sequelize.define('TicketComment', {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true
    },
    content: {
      type: DataTypes.TEXT,
      allowNull: false
    },
    isInternal: {
      type: DataTypes.BOOLEAN,
      defaultValue: false
    },
    ticketId: {
      type: DataTypes.UUID,
      allowNull: false,
      references: {
        model: 'SupportTickets',
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
    attachments: {
      type: DataTypes.JSONB,
      defaultValue: []
    }
  }, {
    timestamps: true,
    indexes: [
      { fields: ['ticketId'] },
      { fields: ['createdBy'] }
    ]
  });

  TicketComment.associate = (models) => {
    TicketComment.belongsTo(models.SupportTicket, { foreignKey: 'ticketId' });
    TicketComment.belongsTo(models.User, { foreignKey: 'createdBy', as: 'creator' });
  };

  return TicketComment;
};