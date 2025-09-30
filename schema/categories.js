const { DataTypes } = require("sequelize");
const sequelize = require("../config/db");

const Categories = sequelize.define('Categories', {
    cat_id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4, // auto-generate UUID
        primaryKey: true
    },
    name: {
        type: DataTypes.STRING,
        allowNull: true
    },
    slug: {
        type: DataTypes.INTEGER,
        unique: true,
        allowNull: true
    },
    metdata: {
        type: DataTypes.JSONB
    },
    parent_id: {
        type: DataTypes.UUID,
        allowNull: true,
        references: {
            model: 'Categories', // self-reference
            key: 'cat_id'
        }
    }
})
Categories.belongsTo(Categories,{foreignKey:'cat_id', as: 'categories'})
module.exports=Categories;