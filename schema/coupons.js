const { DataTypes } = require("sequelize");
const sequelize = require("../config/db");
const coupons=sequelize.define('coupons',{
     cop_id: {
            type: DataTypes.UUID,
            defaultValue: DataTypes.UUIDV4, // auto-generate UUID
            primaryKey: true
        },
        code:{
            type:DataTypes.STRING,
            unique:true,
            allowNull:false,

        },
        descriptiion:{
            type:DataTypes.STRING,
            allowNull:false
        },
        discount_type:{
            type:DataTypes.ENUM('fixed','percentage'),
            allowNull:false
        },
        discount_value:{
            type:DataTypes.DECIMAL(12,2),
            allowNull:false
        },
        usage_limit:{
            type:DataTypes.INTEGER,
            allowNull:false
        },
        per_user_limit:{
            type:DataTypes.INTEGER,
            allowNull:false
        },
        conditions:{
            type:DataTypes.JSONB
        }
},{
    timestamps:true,
    starts_at:'starts_at',
    ends_at:'ends_at'
})