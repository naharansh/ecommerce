const { DataTypes } = require('sequelize')
const sequelize = require('../config/db.js')
const products = require('./product.js')
const Sks = sequelize.define('SKS', {
    id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4, // auto-generate UUID
        primaryKey: true
    },

    product_id: {
        type: DataTypes.UUID,
        references: {
            model: products,   // should be the imported Product model
            key: "product_id"
        },
        allowNull: true,
        validate: {
            isUUID: 4 // must be a valid UUID v4
        }
    },

    sku_code: {
        type: DataTypes.STRING,
        unique: true,
        allowNull: false,
        validate: {
            notEmpty: { msg: "SKU code cannot be empty" },
            len: { args: [3, 50], msg: "SKU code must be between 3 and 50 characters" }
        }
    },

    price: {
        type: DataTypes.DECIMAL(12, 2),
        allowNull: false,
        validate: {
            isDecimal: { msg: "Price must be a valid decimal number" },
            min: { args: [0.01], msg: "Price must be greater than 0" }
        }
    },

    sale_price: {
        type: DataTypes.DECIMAL(12, 2),
        allowNull: false,
        validate: {
            isDecimal: { msg: "Sale price must be a valid decimal number" },
            min: { args: [0.01], msg: "Sale price must be greater than 0" },
            isLessThanPrice(value) {
                if (value > this.price) {
                    throw new Error("Sale price cannot be greater than base price");
                }
            }
        }
    },

    stock: {
        type: DataTypes.INTEGER,
        allowNull: false,
        validate: {
            isInt: { msg: "Stock must be an integer" },
            min: { args: [0], msg: "Stock cannot be negative" }
        }
    },

    weight_grams: {
        type: DataTypes.INTEGER,
        allowNull: true,
        validate: {
            isInt: { msg: "Weight must be an integer" },
            min: { args: [0], msg: "Weight cannot be negative" }
        }
    },

    attributes: {
        type: DataTypes.JSONB,
        validate: {
            isValidJSON(value) {
                if (value && typeof value !== "object") {
                    throw new Error("Attributes must be a valid JSON object");
                }
            }
        }
    },

    is_active: {
        type: DataTypes.BOOLEAN,
        defaultValue: true,
    }
}, {
    timestamps: true,
    createdAt: "created_at",
    updatedAt: "updated_at"
});
Sks.belongsTo(products,{foreignKey:'product_id',as:'pid'})
module.exports=Sks;