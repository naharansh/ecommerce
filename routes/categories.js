const express=require('express')
const routers=express.Router()
const controllers=require('../controllers/categories.js')
const protected=require('../middleware/middleware.js')
routers.get('/categories',controllers.Getcategories).post('/categories', protected.Protected,controllers.Createcategories ).post('/attributes',controllers.Attributes)
routers.get('/allcategories',controllers.Getcategories)
module.exports=routers