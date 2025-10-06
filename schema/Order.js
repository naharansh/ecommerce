const { DataTypes } = require("sequelize");
const sequelize = require("../config/db");
const User = require("./users");
const Shops = require("./vendors");
const Order = sequelize.define('orders', {
    order_number: {
        type: DataTypes.STRING,

        allowNull: false,
        unique: true,
    },
    status: {
        type: DataTypes.ENUM('pending', ' paid', ' shipped', 'delivered', 'cancelled', 'refunded'),

    },
    total_amount: {
        type: DataTypes.DECIMAL(14, 2),

    },
    shipping_address: {
        type: DataTypes.JSONB,

    },
    billing_address: {
        type: DataTypes.JSONB
    },
    payment_Address: {
        type: DataTypes.ENUM('pending', 'paid', 'shipped', 'delivered', 'cancelled', 'refunded')
    },
    metadata: {
        type: DataTypes.JSONB
    },
   order_id: {

        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4, // auto-generate UUID
        primaryKey: true,
    },
    user_id: {
        type: DataTypes.UUID,
        allowNull: true,
        references: {
            model: User,
            key: "user_id",
        },
      
    },
    vendor_id: {
        type: DataTypes.UUID,
        allowNull: true,
        references: {
            model: Shops,
            key: "vender_id",
        },
        
    }


}, {
    placed_at: 'placed_At',
    timestamps: true
})
Order.belongsTo(User,{foreignKey:'user_id',as:'uid' })
Order.belongsTo(Shops,{foreignKey:'vendor_id',as:'vid'})
module.exports=Order