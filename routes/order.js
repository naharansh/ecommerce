const express = require('express')
const controllers = require('../controllers/order.js')

const tes = require('../controllers/payment.js')
const middle = require('../middleware/middleware')
const routers = express.Router()
routers.post('/checkout', middle.Protected, controllers.OrderItems)
routers.get('/orders', middle.Protected, controllers.GetItems).get('/orders/:order_item', middle.Protected, controllers.Details).post('/orders/:orderId/cancel',middle.Protected,controllers.Cancel).post('/orders/:orderId/ship',controllers.Shipments)
module.exports=routers