const express=require('express')
const controllers=require('../controllers/vendorcontrollers.js')
const routers=express.Router()
routers.post('/createVendor',controllers.Createvender).get('/vendors',controllers.getVendors).get('/vendors/:ids',controllers.vendorDetails).get('/testing',controllers.authorizeVendorOrAdmin)
module.exports=routers