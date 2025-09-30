const { Sequelize } = require("sequelize");
require("dotenv").config();

const sequelize = new Sequelize(
  process.env.DATABASE, // database name
  process.env.USERS,    // username
  process.env.PASSWORD, // password
  {
    host: process.env.HOST,
    dialect:"postgres" ,    // 👈 required
    port: process.env.DB_PORT || 5432,
    logging: false,
  }
);

// Test connection
sequelize.authenticate()
  .then(() => console.log("✅ Database connected"))
  .catch(err => console.error("❌ DB connection failed:", err));

module.exports = sequelize;