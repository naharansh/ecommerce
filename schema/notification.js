const { DataTypes } = require("sequelize");
const sequelize = require("../config/db");
const  Notifications=sequelize.define('Notifications',{
      id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4, // auto-generate UUID
        primaryKey: true
    },
    title:{
        type:DataTypes.STRING,

    },
    Delivery:{
        type:DataTypes.ENUM('email','sms','push','inapp'),

    },
    is_read:{
        type:DataTypes.BOOLEAN
    }
},{
    timestamps:true,
    createdAt:'created_at'
})