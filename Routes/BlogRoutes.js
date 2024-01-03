const {Router} = require('express')
const AuthenticatedRoutes = Router()
const fileupload = require('express-fileupload')
const {isLoggedIn,loggedInUser,isLoggedInApi} = require('../Middlewares/Authentication')
const {Index} = require('../Controller/BlogController.js')
const blogRoutes = Router()

blogRoutes.get('/Articles/User',isLoggedIn,loggedInUser,Index)



module.exports = blogRoutes