const sequelize = require('../config/db.js')
const { DataTypes } = require('sequelize')
const Cart = require('./cart.js')
const Sks = require('./SKU.js')
const CartItems = sequelize.define('CartItems', {
  id: { type: DataTypes.UUID, defaultValue: DataTypes.UUIDV4, primaryKey: true },
  cart_id: {
    type: DataTypes.UUID,
    allowNull: true,
    references: { model: Cart, key: "cart_id" }
  },
  sku_id: {
    type: DataTypes.UUID,
    allowNull: false,
    references: { model: Sks, key: "id" }
  },
  quantity: { type: DataTypes.INTEGER, allowNull: false, defaultValue: 1 },
  metadata: { type: DataTypes.JSONB, allowNull: true },
  unit_price: {
    type: DataTypes.DECIMAL(12, 2),
    allowNull: false,
    defaultValue: 0,
    validate: {
      min: { args: [0], msg: "Unit price cannot be negative" },
      isDecimal: { msg: "Unit price must be a valid decimal number" }
    }
  }
}, {
  timestamps: true,
  createdAt: 'added_at',
  updatedAt: 'updated_at'
})

CartItems.belongsTo(Cart, { foreignKey: 'cart_id', as: 'cid' })
CartItems.belongsTo(Sks, { foreignKey: 'sku_id', as: 'sid' })

module.exports = CartItems