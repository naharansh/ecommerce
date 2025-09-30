const { DataTypes } = require('sequelize');
const sequelize = require('../config/db.js');
const User = require('./users'); // make sure this exports User model

const Shops = sequelize.define('Vendors', {
    vender_id: {
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
    name: {
        type: DataTypes.STRING,
        allowNull: false
    },
    slug: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true
    },
    description: {
        type: DataTypes.STRING,
        allowNull: false
    },
    status: {
        type: DataTypes.ENUM('pending', 'active', 'suspended'),
        allowNull: false
    },
    address: {
        type: DataTypes.JSONB
    },
}, {
    timestamps: true,
    createdAt: "created_at",
    updatedAt: "updated_at"
});

// Association
Shops.belongsTo(User, { foreignKey: 'user_id', as: "user" });

module.exports = Shops;