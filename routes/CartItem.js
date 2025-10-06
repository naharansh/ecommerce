const express=require('express')
const routerss=express.Router()
const controllers=require('../controllers/cartitems.js')
const middle=require('../middleware/middleware.js')
routerss.post('/cart/items',middle.Protected,controllers.addItem).get('/users/cart',middle.Protected,controllers.GetCart).post('/users/getcoupoen',controllers.PostCoupean)
routerss.put('/cart/items/:itemId',controllers.UpdateCart).post('/cart/apply-coupon',middle.Protected,controllers.ApplyCoupean).post('/cart/estimate',middle.Protected,controllers.estimateCart).delete('/cart/items/:id ',controllers.DeleteItem)
module.exports=routerss;