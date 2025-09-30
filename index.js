const express=require('express')
const dotenv=require('dotenv').config({path:'./config/config.env'})
const cookieParser=require('cookie-parser')
const sequelize = require("./config/db");
const  route  = require('./routes/routes');
const vroutes=require('./routes/vroutes.js')
const app=express()
app.use(express.json())
app.use(cookieParser())
const PORT=process.env.PORT ||8080
// ConnectionDb()
app.use('/api/v1/auth',route)
app.use('/api/v1/auth',vroutes)

sequelize.sync({ alter: true })
  .then(() => console.log("✅ Tables synced"))
  .catch(err => console.error("❌ Sync error:", err));
app.listen(PORT,()=>{
    console.log("SERVER IS STARTED AT 8080")
})