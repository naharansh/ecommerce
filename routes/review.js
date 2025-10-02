const express=require('express')
const middleware=require('../middleware/middleware.js')
const controllers=require('../controllers/review.js')
const routers=express.Router()
routers.post('/products/:ids/reviews',middleware.Protected,controllers.CreateReview).get('/products/:ids/reviews',controllers.GetReviews).post('/reviews/:ids/approve',middleware.Protected,controllers.IsApprove)
module.exports=routers