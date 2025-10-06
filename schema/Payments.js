const { DataTypes } = require('sequelize');
const sequelize = require('../config/db.js');
const Order = require('./Order.js');

const Payment = sequelize.define('Payments', {
  pid: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true,
  },
   gateway_payment_id: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  amount: {
    type: DataTypes.DECIMAL(14, 2),
    allowNull: false,
  },
  status: {
    type: DataTypes.ENUM('initiated', 'succeeded', 'failed', 'refunded'),
    allowNull: false,
  },
  raw_response: {
    type: DataTypes.JSONB,
  },
  order_id: {
    type: DataTypes.UUID,
    allowNull: true,
    references: {
      model: Order,
      key: "order_id",
    },
  },
}, {
  timestamps: true,
  createdAt: "created_at",
  updatedAt: "updated_at",
});

// Association
Payment.belongsTo(Order, { foreignKey: 'order_id', as: 'oid' });

module.exports = Payment;
