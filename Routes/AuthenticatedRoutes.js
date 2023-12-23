const {Router} = require('express')
const AuthenticatedRoutes = Router()
const fileupload = require('express-fileupload')
const {Index,Profile,getProfileData} = require('../Controller/AuthenticatedController')
const {isLoggedIn,loggedInUser,isLoggedInApi} = require('../Middlewares/Authentication')
AuthenticatedRoutes.get("/Dashboard", isLoggedIn,loggedInUser,Index)
.get("/User/Profile", isLoggedIn,loggedInUser,Profile)
.post("/get-profile-data", isLoggedInApi,loggedInUser,fileupload({createParentPath:true}),getProfileData)
module.exports = AuthenticatedRoutes