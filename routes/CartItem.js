const express=require('express')
const routerss=express.Router()
const controllers=require('../controllers/cartitems.js')
const middle=require('../middleware/middleware.js')
routerss.post('/items',middle.Protected,controllers.addItem)
module.exports=routerss;