const { DataTypes } = require("sequelize");
const sequelize = require("../config/db");

const Categories = sequelize.define('Categories', {
  cat_id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4, // auto-generate UUID
    primaryKey: true,
  },
  name: {
    type: DataTypes.STRING(100), // limit length
    allowNull: false,
    validate: {
      notNull: { msg: "Category name is required" },
      notEmpty: { msg: "Category name cannot be empty" },
      len: {
        args: [2, 100],
        msg: "Category name must be between 2 and 100 characters",
      },
    },
  },
  slug: {
    type: DataTypes.STRING, // better as string (instead of INTEGER)
    unique: true,
    allowNull: false,
    validate: {
      notNull: { msg: "Slug is required" },
      notEmpty: { msg: "Slug cannot be empty" },
      is: {
        args: /^[a-z0-9]+(?:-[a-z0-9]+)*$/i,
        msg: "Slug must be URL-friendly (e.g. my-category, electronics-phones)",
      },
    },
  },
  metadata: {
    type: DataTypes.JSONB,
    allowNull: true,
    validate: {
      isValidJson(value) {
        if (value && typeof value !== "object") {
          throw new Error("Metadata must be a valid JSON object");
        }
      },
    },
  },
  parent_id: {
    type: DataTypes.UUID,
    allowNull: true,
    references: {
      model: "Categories", // self-reference
      key: "cat_id",
    },
    validate: {
      notSelf(value) {
        if (value && value === this.cat_id) {
          throw new Error("A category cannot be its own parent");
        }
      },
    },
  },
});

Categories.belongsTo(Categories,{foreignKey:'cat_id', as: 'categories'})
module.exports=Categories;