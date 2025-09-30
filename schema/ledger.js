const { DataTypes } = require("sequelize");
const sequelize = require("../config/db");
const Legers=sequelize.define('Ledger',{
    Leger_id:{
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
    type:{
        type:DataTypes.ENUM('sale','fee','payout','refund'),
        allowNull:false
    },
    amount:{
        type:DataTypes.DECIMAL(14,2),
        allowNull:false
    },
    balence_after:{
        type:DataTypes.DECIMAL(14,2),
        allowNull:false
    },
    metadata:{
        type:DataTypes.JSONB
    },
},{
    timestamps:true,
    created_at:'created_at'
})