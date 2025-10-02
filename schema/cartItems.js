const { DataTypes } = require("sequelize");
const sequelize = require("../config/db");
const Cart = require("./cart");
const Sks = require("./SKU");
const CartItems = sequelize.define('CartItmes', {
id: { type: DataTypes.UUID, defaultValue: DataTypes.UUIDV4, primaryKey: true },
  cart_id: {
    type: DataTypes.UUID,
    allowNull: false,
    references: { model: "carts", key: "cart_id" } // lowercase matches Cart
  },
  sku_id: { type: DataTypes.UUID, allowNull: false, references: { model: "products", key: "sku_id" } },
  quantity: { type: DataTypes.INTEGER, allowNull: false, defaultValue: 1 },
  metadata: { type: DataTypes.JSONB, allowNull: true },
    unit_price: {
        type: DataTypes.DECIMAL(12, 2),
        allowNull: false,
        defaultValue: 0,
        validate: {
            min: {
                args: [0],
                msg: "Unit price cannot be negative"
            },
            isDecimal: {
                msg: "Unit price must be a valid decimal number"
            }
        }
    }
}, {
    added_at: 'added_at',
    timestamps: true
})
CartItems.belongsTo(Cart,{foreignKey:'cart_id',as:'cid'})
CartItems.belongsTo(Sks,{foreignKey:'sku_id',as:'sid'})
module.exports=CartItems