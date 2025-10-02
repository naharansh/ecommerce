const { DataTypes } = require("sequelize");
const sequelize = require("../config/db");
// const Order = require("./Order");
const Order = require("./Order");
const Shops = require("./vendors");
const OrderItem = sequelize.define('order_item', {
    unitPrice: {
        type: DataTypes.DECIMAL(12, 2),

    },
    subtotal: {
        type: DataTypes.DECIMAL(14, 2),

    },
    product_snapshot: {
        type: DataTypes.JSONB
    },

    id: {

        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4, // auto-generate UUID
        primaryKey: true,
    },
    quantity: {
        type: DataTypes.INTEGER
    },
    Vendor_id: {
        type: DataTypes.UUID,
        allowNull: true,
        references: {
            model: Shops,
            key: "vender_id",
        },
        validate: {
            notSelf(value) {
                if (value && value === this.vender_id) {
                    throw new Error("A category cannot be its own parent");
                }
            },
        },
    },
    Order_id:{
        type: DataTypes.UUID,
        allowNull: true,
        references: {
            model: Order,
            key: "id",
        },
        validate: {
            notSelf(value) {
                if (value && value === this.id) {
                    throw new Error("A category cannot be its own parent");
                }
            },
        }, 
    }

})
OrderItem.belongsTo(Order,{foreignKey:'Order_id',as:'oid'})
OrderItem.belongsTo(Shops,{foreignKey:'Vendor_id',as:'vid'})
module.exports=OrderItem