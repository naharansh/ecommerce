const { DataTypes } = require('sequelize')
const sequelize = require('../config/db.js');
const Order = require('./Order.js');
const datas = sequelize.define('Shipment', {
    id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4, // auto-generate UUID
        primaryKey: true

    },
    order_id: {

        type: DataTypes.UUID,
        allowNull: true,
        references: {
            model: Order,
            key: "order_id",
        },
        validate: {
            notSelf(value) {
                if (value && value === this.user_id) {
                    throw new Error("A category cannot be its own parent");
                }
            },
        },
    },
    carrier: {
        type: DataTypes.STRING,
        allowNull: false,

    },
    tracking_number: {
        type: DataTypes.STRING,
        allowNull: false,

    },
    status: {
        type: DataTypes.ENUM('pending', 'shipped', ' in_transit', ' delivered', 'returned'),
        allowNull: true,
    }


}, {
    timestamps: true,           // 👈 enables createdAt and updatedAt automatically
    shipped_at: "created_at",    // optional: custom column name
    delivered_at: "updated_at"
})
datas.belongsTo(Order,{foreignKey:'order_id',as:'oid'})
module.exports = datas