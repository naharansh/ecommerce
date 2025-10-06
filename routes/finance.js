const express=require('express')
const controllers=require('../controllers/finance.js')
const pcontrollers=require('../middleware/middleware.js')
const routers=express.Router()
routers.get('/admin/ledger',controllers.Admins).post('/admin/payouts/:vendorId',pcontrollersProtected,controllers.Initiate)
routers.get('/vendors/:vendorId/ledger',controllers.Legers)
module.exports=routers