const {Router} = require('express')
const AuthenticatedRoutes = Router()
const fileupload = require('express-fileupload')
const {isLoggedIn,loggedInUser,isLoggedInApi} = require('../Middlewares/Authentication')
const {Index,GetSubcategories,GetPostData,GetSingleArticle,WorkOnArticles} = require('../Controller/BlogController.js')
const blogRoutes = Router()

blogRoutes.get('/Articles/User',isLoggedIn,loggedInUser,Index)
.post("/Get/Subategories",isLoggedIn,loggedInUser,GetSubcategories)
.post("/Post-articles",isLoggedIn,loggedInUser,fileupload({createParentPath:true}),GetPostData)
.post("/Get-Single-Article",isLoggedIn,loggedInUser,GetSingleArticle)
.post("/WorkOnArticles",isLoggedIn,loggedInUser,WorkOnArticles)

module.exports = blogRoutes