const express=require('express')
const controllers=require('../controllers/skus.js')
const routes=express.Router()
routes.post('/products/:productId/skus',controllers.Addskus).put('/updateuser/:ids',controllers.UpdateSkus)
routes.post('/skus/:skuId/stock-adjust',controllers.Adjustment)
module.exports=routes