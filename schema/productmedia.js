const { DataTypes } = require('sequelize')
const sequelize = require('../config/db.js')
const Sks = require('./SKU.js')
const Products = require('./product.js')
const ProductMedia = sequelize.define("ProductMedia", {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4, // auto-generate UUID
    primaryKey: true,
  },

  url: {
    type: DataTypes.TEXT,
    allowNull: false,
    validate: {
      isUrl: {
        msg: "URL must be a valid link"
      },
      notEmpty: {
        msg: "Media URL cannot be empty"
      }
    }
  },

  media_type: {
    type: DataTypes.ENUM("image", "video"),
    allowNull: false,
    validate: {
      isIn: {
        args: [["image", "video"]],
        msg: "Media type must be either image or video"
      }
    }
  },

  sort_order: {
    type: DataTypes.INTEGER,
    defaultValue: 0,
    validate: {
      isInt: {
        msg: "Sort order must be an integer"
      },
      min: {
        args: [0],
        msg: "Sort order cannot be negative"
      }
    }
  },

  product_id: {
    type: DataTypes.UUID,
    references: {
      model: Products,
      key: "product_id"   // must match the PK in your Products table
    },
    allowNull: false,
    validate: {
      notEmpty: {
        msg: "Product ID is required"
      },
      isUUID: {
        args: 4,
        msg: "Product ID must be a valid UUID"
      }
    }
  },

  sku_id: {
    type: DataTypes.UUID,
    references: {
      model: Sks,
      key: "id"
    },
    allowNull: true,
    validate: {
      isUUID: {
        args: 4,
        msg: "SKU ID must be a valid UUID"
      }
    }
  }
}, {
  tableName: "product_media",
  timestamps: true,
  createdAt: "created_at",
  updatedAt: "updated_at"
});

ProductMedia.belongsTo(Products,{foreignKey:'product_id',as:'pid'})
ProductMedia.belongsTo(Sks,{foreignKey:'id',as:'skuid'})
module.exports = ProductMedia