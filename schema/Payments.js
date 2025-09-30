const { DataTypes, ENUM } = require('sequelize')
const sequelize = require('../config/db.js')
const payment=sequelize.define('Payments',{
    pid: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4, // auto-generate UUID
        primaryKey: true

    },
    gateway:{
        type:DataTypes.STRING,
        allowNull:false,      
    },
    gateway_payment:{
        type:DataTypes.STRING,
        allowNull:false
    },
    gateway_payment_id:{
        type:DataTypes.STRING,
        allowNull:false
    },
    amount:{
        type:DataTypes.DECIMAL(14,2),
        allowNull:false
    },
    status:{
        type:DataTypes.ENUM('initiated', 'succeeded', 'failed', 'refunded'),
        allowNull:false
    },
    raw_response:{
        type:DataTypes.JSONB,

    }


},{
    timestamps: true,           // 👈 enables createdAt and updatedAt automatically
    created_at: "created_at",    // optional: custom column name
    
})  
module.exports=payment