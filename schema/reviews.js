const { DataTypes } = require("sequelize");
const sequelize = require("../config/db");
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
        allowNull:false
    },
    title:{
        type:DataTypes.STRING,
        allowNull:false
    },  
    body:{
        type:DataTypes.STRING,
        allowNull:false
    },
    approved:{
        type:DataTypes.BOOLEAN,
        defaultValue:false,

    }   
},{
    timestamps:true,
    createdAt:'created_at'
})