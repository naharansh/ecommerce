const { DataTypes } = require('sequelize')
const sequelize = require('../config/db.js')
const payment = require('./Payments.js')
const datas = sequelize.define('Refunds', {
    refund_id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4, // auto-generate UUID
        primaryKey: true

    },
    payment_id:{
        
        type: DataTypes.UUID,
        references: {
            model:payment,
            key: "pid"
        },
        allowNull: true
    
    },
    amount:{
        type:DataTypes.DECIMAL(14,2),
        allowNull:false
    },
    reason:{
        type:DataTypes.STRING,
        allowNull:false
    },
    status:{
        type:DataTypes.ENUM('pending', 'approved','rejected', 'completed'),
        allowNull:false
    }
},{
    timestamps:true,
    createdAt:'created_at'
})
module.exports=datas