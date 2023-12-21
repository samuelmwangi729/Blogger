const {Router} = require('express')
const AuthenticatedRoutes = Router()
const {Index} = require('../Controller/AuthenticatedController')
const {isLoggedIn,loggedInUser} = require('../Middlewares/Authentication')
AuthenticatedRoutes.get("/Dashboard", isLoggedIn,loggedInUser,Index)

module.exports = AuthenticatedRoutes