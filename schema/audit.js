const { DataTypes } = require("sequelize");
const sequelize = require("../config/db");
const audit = sequelize.define('Audits', {
    id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4, // auto-generate UUID
        primaryKey: true

    },
    action:{
        type:DataTypes.STRING,

    },
    resourec_type:{
         type:DataTypes.STRING,
    },
    resourec_id:{
        type:DataTypes.STRING
    },
    payload:{
        type:DataTypes.JSONB
    }
},{
    timestamps:true,
    createdAt:'createdAt'
})