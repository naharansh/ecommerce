const { DataTypes } = require("sequelize");
const sequelize = require("../config/db");
const Answer=sequelize.define('Q&A',{
    QA_id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4, // auto-generate UUID
        primaryKey: true
    },
    question:{
        type:DataTypes.STRING,

    },
    answer:{
        type:DataTypes.STRING
    },

},{
    timestamps:true,
    createdAt:'created_at'
})