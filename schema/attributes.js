const { DataTypes } = require('sequelize')
const sequelize = require('../config/db.js')
const data = sequelize.define('Attributes', {
    id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4, // auto-generate UUID
        primaryKey: true
    },
    name: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    values: {
        type: DataTypes.JSONB
    }
})