const express=require('express')
const controllers=require('../controllers/controllers.js')
const  middleware=require('../middleware/middleware.js')
const routers=express.Router()
routers.post('/register',controllers.registerUser).post('/login',controllers.Login).get('/me',middleware.Protected, controllers.GetDetails).put('/me',middleware.Protected,controllers.UpdateDetails).post('/refresh',controllers.RrefreshToken).post('/logout',controllers.LogOut).post('/reset',controllers.ResetPassword).post('/forget',controllers.ForgetPassword)
module.exports=routers