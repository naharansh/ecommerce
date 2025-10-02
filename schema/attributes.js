const { DataTypes } = require('sequelize')
const sequelize = require('../config/db.js')
const data = sequelize.define('Attributes', {
   id: {
  type: DataTypes.UUID,
  defaultValue: DataTypes.UUIDV4, // auto-generate UUID
  primaryKey: true,
},
name: {
  type: DataTypes.STRING(100), // limit max length
  allowNull: false,
  
  validate: {
    notNull: { msg: "Name is required" },
    notEmpty: { msg: "Name cannot be empty" },
    len: {
      args: [2, 100],
      msg: "Name must be between 2 and 100 characters"
    }
  }
},
values: {
  type: DataTypes.JSONB,
  allowNull: true,
  validate: {
    isValidJson(value) {
      if (value && typeof value !== "object") {
        throw new Error("Values must be a valid JSON object or array");
      }
    },
    notEmptyValues(value) {
      if (value && Array.isArray(value) && value.length === 0) {
        throw new Error("Values array cannot be empty");
      }
    }
}
}
})
module.exports=data