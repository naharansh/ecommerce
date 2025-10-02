const { DataTypes } = require('sequelize')
const sequelize = require('../config/db.js')
const Shops = require('./vendors.js')
const Categories = require('./categories.js')
const Products = sequelize.define('Products', {
    product_id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true
    },
    vendor_id: {
        type: DataTypes.UUID,
        references: {
            model: Shops,
            key: "vender_id"
        },
        allowNull: false,
        validate: {
            isUUID: {
                args: 4,
                msg: "vendor_id must be a valid UUIDv4"
            }
        }
    },
    title: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
            notEmpty: { msg: "Product title cannot be empty" },
            len: { args: [3, 150], msg: "Product title must be between 3 and 150 characters" }
        }
    },
    slug: {
        type: DataTypes.STRING,
        unique: { msg: "Slug must be unique" },
        allowNull: true,
        validate: {
            is: {
                args: /^[a-z0-9]+(?:-[a-z0-9]+)*$/i,
                msg: "Slug must contain only letters, numbers, and dashes (e.g. macbook-pro-16)"
            }
        }
    },
    short_description: {
        type: DataTypes.STRING,
        allowNull: true,
        validate: {
            len: {
                args: [0, 200],
                msg: "Short description can be max 200 characters"
            }
        }
    },
    long_description: {
        type: DataTypes.TEXT, // better than STRING if it’s long
        allowNull: true,
        validate: {
            len: {
                args: [0, 2000],
                msg: "Long description can be max 2000 characters"
            }
        }
    },
    category_id: {
        type: DataTypes.UUID,
        references: {
            model: Categories,
            key: "cat_id"
        },
        allowNull: true,
        validate: {
            isUUID: {
                args: 4,
                msg: "category_id must be a valid UUIDv4"
            }
        }
    },
    status: {
        type: DataTypes.ENUM('draft', 'published', 'archived'),
        allowNull: false,
        defaultValue: 'draft',
        validate: {
            isIn: {
                args: [['draft', 'published', 'archived']],
                msg: "Status must be one of: draft, published, archived"
            }
        }
    },
    is_featured: {
        type: DataTypes.BOOLEAN,
        defaultValue: false
    }
}, {
    timestamps: true,
    createdAt: "created_at",
    updatedAt: "updated_at"
});
Products.belongsTo(Shops,{foreignKey:'vendor_id',as:'vid'})
Products.belongsTo(Categories,{foreignKey:'category_id',as:'cid'})
module.exports=Products