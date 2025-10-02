const express=require('express')
const controllers=require('../controllers/notification.js')
const middle=require('../middleware/middleware.js')
const routers=express()
routers.post('/notifications/send',middle.Protected,controllers.Sends).get('/notifications',controllers.ALLdata)
module.exports=routers;