const express=require('express')
const controllers=require('../controllers/vendorcontrollers.js')
const middleware=require('../middleware/middleware.js')
const routers=express.Router()
routers.post('/createVendor',controllers.Createvender).get('/vendors',controllers.getVendors).get('/vendors/:ids',controllers.vendorDetails).put('/testing/:vendorId',middleware.Protected,controllers.testings).post('/approve/:ids',middleware.Protected,controllers.Approved)
module.exports=routers
