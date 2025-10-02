const { DataTypes } = require('sequelize');
const sequelize = require('../config/db.js');

const User = sequelize.define("User", {
    user_id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4, // auto-generate UUID
        primaryKey: true
    },
    name: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
            notEmpty: { msg: "Name cannot be empty" },
            len: { args: [3, 50], msg: "Name must be between 3 and 50 characters" },
            isAlpha: { msg: "Name should only contain letters" }
        }
    },
    email: {
        type: DataTypes.STRING,
        unique: { msg: "Email already exists" },
        allowNull: false,
        validate: {
            notEmpty: { msg: "Email cannot be empty" },
            isEmail: { msg: "Invalid email format" }
        }
    },
    password: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
            notEmpty: { msg: "Password cannot be empty" },
            len: { args: [8, 100], msg: "Password must be at least 8 characters long" }
        }
    },
    phone: {
        type: DataTypes.STRING,
        validate: {
            is: {
                args: [/^\d{10}$/], // only 10 digits
                msg: "Phone number must be 10 digits"
            }
        }
    },
    role: {
        type: DataTypes.ENUM('customer', 'vendor_staff', 'vendor_owner', 'admin'),
        defaultValue: 'customer',
        validate: {
            isIn: {
                args: [['customer', 'vendor_staff', 'vendor_owner', 'admin']],
                msg: "Role must be one of: customer, vendor_staff, vendor_owner, admin"
            }
        }
    },
    is_active: {
        type: DataTypes.BOOLEAN,
        defaultValue: true
    },
    metadata: {
        type: DataTypes.JSONB,
        validate: {
            isValidJson(value) {
                if (value && typeof value !== "object") {
                    throw new Error("Metadata must be a valid JSON object");
                }
            }
        }
    },
    resetPasswordToken: { 
        type: DataTypes.STRING,
        allowNull: true 
    },
    resetPasswordExpires: { 
        type: DataTypes.DATE,
        allowNull: true,
        validate: {
            isDate: { msg: "resetPasswordExpires must be a valid date" }
        }
    }
}, {
    timestamps: true,           // 👈 enables createdAt and updatedAt automatically
    createdAt: "created_at",    // custom column name
    updatedAt: "updated_at"
});

module.exports = User;