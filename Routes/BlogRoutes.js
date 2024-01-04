const {Router} = require('express')
const AuthenticatedRoutes = Router()
const fileupload = require('express-fileupload')
const {isLoggedIn,loggedInUser,isLoggedInApi} = require('../Middlewares/Authentication')
const {Index,GetSubcategories,GetPostData} = require('../Controller/BlogController.js')
const blogRoutes = Router()

blogRoutes.get('/Articles/User',isLoggedIn,loggedInUser,Index)
.post("/Get/Subategories",isLoggedIn,loggedInUser,GetSubcategories)
.post("/Post-articles",isLoggedIn,loggedInUser,fileupload({createParentPath:true}),GetPostData)


module.exports = blogRoutes