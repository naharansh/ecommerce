const { DataTypes } = require('sequelize')
const sequelize = require('../config/db.js')
const Shops = require('./vendors.js')
const Categories = require('./categories.js')
const products = sequelize.define('Products', {
    product_id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4, // auto-generate UUID
        primaryKey: true
    },
    vendor_id: {
        type: DataTypes.UUID,
        references: {
            model:Shops,
            key: "vender_id"
        },
        allowNull: true
    },
    title:{
            type:DataTypes.STRING,
            allowNull:false
    },
    slug:{
        type:DataTypes.STRING,
        unique:true,
        allowNull:true
    },
    short_description:{
        type:DataTypes.STRING,

    },
    long_description:{
        type:DataTypes.STRING
    },
    category_id :{
        type: DataTypes.UUID,
        references: {
            model:Categories,
            key: "cat_id"
        },
        allowNull: true
    },
    status:{
        type:DataTypes.ENUM('draft','published','archived'),
        allowNull:true
    },
    is_featured:{
        type:DataTypes.BOOLEAN,
        defaultValue:false
    }
},{
    timestamps: true,           // 👈 enables createdAt and updatedAt automatically
    createdAt: "created_at",    // optional: custom column name
    updatedAt: "updated_at"
})
products.belongsTo(Shops,{foreignKey:'vender_id',as:'vid'})
products.belongsTo(Categories,{foreignKey:'category_id',as:'cid'})
module.exports=products