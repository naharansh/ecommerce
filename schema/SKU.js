const { DataTypes } = require('sequelize')
const sequelize = require('../config/db.js')
const products = require('./product.js')
const Sks = sequelize.define('SKS', {
    id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4, // auto-generate UUID
        primaryKey: true
    },
    product_id: {
        type: DataTypes.UUID,
        references: {
            model: products,
            key: "product_id"
        },
        allowNull: true
    },
    sku_code: {
        type: DataTypes.STRING,
        unique: true,
        allowNull: false
    },
    price: {
        type: DataTypes.DECIMAL(12, 2),
        allowNull: false,

    },
    sale_price: {
        type: DataTypes.DECIMAL(12, 2),
        allowNull: false,

    },
    stock: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    weight_grams: {
        type: DataTypes.INTEGER,
        allowNull: true
    },
    attributes: {
        type: DataTypes.JSONB,

    },
    is_active: {
        type: DataTypes.BOOLEAN,
        defaultValue: true,
    }
}, {
    timestamps: true,           // 👈 enables createdAt and updatedAt automatically
    createdAt: "created_at",    // optional: custom column name
    updatedAt: "updated_at"
})
Sks.belongsTo(products,{foreignKey:'product_id',as:'pid'})
module.exports=Sks;