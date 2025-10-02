const express=require('express')
const controllers=require('../controllers/utilcontrollers.js')
const routers=express()
routers.get('/health',controllers.SimpleHealth)
 module.exports=routers