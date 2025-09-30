const { DataTypes } = require('sequelize')
const sequelize = require('../config/db.js')
const Sks = require('./SKU.js')
const products = sequelize.define('Products', {
    id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4, // auto-generate UUID
        primaryKey: true

    },
    url: {
        type: DataTypes.TEXT,

    },
    media_type: {
        type: DataTypes.ENUM('image', 'video'),
        allowNull: false,

    },
    sort_order: {
        type: DataTypes.INTEGER,

    },
    product_id: {
        type: DataTypes.UUID,
        references: {
            model: products,
            key: "product_id"
        },
        allowNull: true
    },
    sku_id: {
        type: DataTypes.UUID,
        references: {
            model: Sks,
            key: "id"
        },
        allowNull: true
    }
})
products.belongsTo(products,{foreignKey:'product_id',as:'pid'})
products.belongsTo(Sks,{foreignKey:'id',as:'skuid'})
module.exports = products