const express=require('express')
const controllers=require('../controllers/product')
const vendors=require('../middleware/middleware.js')
const routers=express.Router()
routers.post('/vendors/:ids/products',vendors.Protected,controllers.CreateProduct).get('/products/:productsId',controllers.Details)
routers.put('/products/:ids',vendors.Protected,controllers.UpdateDetails).delete('/productss/:ids',vendors.Protected,controllers.DeleteProducts)
module.exports=routers;