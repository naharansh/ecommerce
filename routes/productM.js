const express=require('express')
const controllers=require('../controllers/proudctc.js')
const routers=express.Router()
routers.post('/products/:productId/media',controllers.Uploads).delete('/products/:pid/media/:fid',controllers.DeleteData)
module.exports=routers