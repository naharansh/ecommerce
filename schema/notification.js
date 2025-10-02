const { DataTypes } = require("sequelize");
const sequelize = require("../config/db");
const User = require("./users");
const Notifications = sequelize.define('Notifications', {
    id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4, // auto-generate UUID
        primaryKey: true,
    },
    title: {
        type: DataTypes.STRING,
        allowNull: false, // validation: required
        validate: {
            notEmpty: { msg: "Title cannot be empty" },
            len: {
                args: [3, 255],
                msg: "Title must be between 3 and 255 characters",
            },
        },
    },
    message: {
        type: DataTypes.STRING,
        allowNull: false, // validation: required
        validate: {
            notEmpty: { msg: "Message cannot be empty" },
            len: {
                args: [3, 255],
                msg: "Message must be between 3 and 255 characters",
            },
        },
    },
    type:{
         type: DataTypes.ENUM("email", "sms", "push", "inapp"),
      allowNull: false, // required
      validate: {
        isIn: {
          args: [["email", "sms", "push", "inapp"]],
          msg: "Delivery must be one of: email, sms, push, inapp",
        },
      },
        
    },
    is_read: {
      type: DataTypes.BOOLEAN,
      defaultValue: false, // default value
      allowNull: false,
    },
    status:{
         type: DataTypes.ENUM("pending", "active", "delayed"),
      allowNull: false, // required
      validate: {
        isIn: {
          args: [["pending", "active", "delayed"]],
          msg: "Delivery must be one of: email, sms, push, inapp",
        },
      }, 
    },
    user_id: {
        type: DataTypes.UUID,
        references: {
            model: User,
            key: "user_id"
        },
        allowNull: true
    },
},
    {
        timestamps: true,
        createdAt: "created_at",
       
    })
    Notifications.belongsTo(User,{foreignKey:'user_id',as:'uid'})
module.exports = Notifications;
