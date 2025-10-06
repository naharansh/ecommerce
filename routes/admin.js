const express=require('express')
const controllers=require('../controllers/admincontrollers')
// const tes=require('../controllers/testing.js')
const middle= require('../middleware/middleware')
const routerss=express.Router()
routerss.get('/admin/users',middle.Protected,controllers.ManageUsers).put('/admin/users/:id/role',controllers.UpdateRoles).get('/admin/vendors',middle.Protected,controllers.ManageVendores).get('/search',controllers.Search)
module.exports=routerss