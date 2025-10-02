const { DataTypes } = require("sequelize");
const sequelize = require("../config/db");
const User = require("./users");

const Cart = sequelize.define('Cart', {
    cart_id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
    },
    user_id: {
        type: DataTypes.UUID,
        allowNull: false,  // cart must belong to a user
        references: {
            model: User,
            key: "user_id",
        }
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
}, {
    timestamps: true,
    createdAt: 'created_at',
    updatedAt: 'updated_at',
    tableName: 'carts'
});

Cart.belongsTo(User, { foreignKey: 'user_id', as: 'user' });

module.exports = Cart;
