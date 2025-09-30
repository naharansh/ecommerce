const { DataTypes } = require('sequelize')
const sequelize = require('../config/db.js')
const User = sequelize.define("User", {
    user_id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4, // auto-generate UUID
        primaryKey: true

    },
    name: {
        type: DataTypes.STRING,
        allowNull: false,

    },
    email: {
        type: DataTypes.STRING,
        unique: true,
        allowNull: false
    },
    password: {
        type: DataTypes.STRING,
        allowNull: false
    },
    phone: {
        type: DataTypes.STRING
    },
    role: {
        type: DataTypes.ENUM('customer', 'vendor_staff', 'vendor_owner', 'admin'),
        defaultValue:'customer'
    },
    is_active: {
        type: DataTypes.BOOLEAN,
        defaultValue: true,
    },
    metadata: {
        type: DataTypes.JSONB
    },
    resetPasswordToken: { type: DataTypes.STRING,
        defaultValue:undefined
     },
    resetPasswordExpires: { type: DataTypes.DATE,
        defaultValue:undefined
     }


}, {
    timestamps: true,           // 👈 enables createdAt and updatedAt automatically
    createdAt: "created_at",    // optional: custom column name
    updatedAt: "updated_at"
})
module.exports = User;