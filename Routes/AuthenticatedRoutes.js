const {Router} = require('express')
const AuthenticatedRoutes = Router()
const {Index,Profile} = require('../Controller/AuthenticatedController')
const {isLoggedIn,loggedInUser} = require('../Middlewares/Authentication')
AuthenticatedRoutes.get("/Dashboard", isLoggedIn,loggedInUser,Index)
.get("/User/Profile", isLoggedIn,loggedInUser,Profile)
module.exports = AuthenticatedRoutes