const { DataTypes } = require("sequelize");
const sequelize = require("../config/db");
// const Shops = require("./vendors");
const Products = require("./product");
const User = require("./users");
const Reviews = sequelize.define('Reviews', {
    r_id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4, // auto-generate UUID
        primaryKey: true
    },
     user_id: {
        type: DataTypes.UUID,
        references: {
            model: User,
            key: "user_id"
        },
        allowNull: true
    },
    ratings:{
        type:DataTypes.INTEGER,
        allowNull:true
    },
    title:{
        type:DataTypes.STRING,
        allowNull:true
    },  
    body:{
        type:DataTypes.STRING,
        allowNull:true
    },
    approved:{
        type:DataTypes.BOOLEAN,
        defaultValue:false,

    }
    ,product_id:{
                type: DataTypes.UUID,
        references: {
            model: Products,
            key: "product_id"
        },
        allowNull: true       
    }   
},{
    timestamps:true,
    createdAt:'created_at'
})
Reviews.belongsTo(Products,{foreignKey:'product_id',as:'pid'})
Reviews.belongsTo(User,{foreignKey:'user_id',as:'uid'})
module.exports=Reviews