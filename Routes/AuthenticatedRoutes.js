const {Router} = require('express')
const AuthenticatedRoutes = Router()
const {isLoggedIn,loggedInUser} = require('../Middlewares/Authentication')
AuthenticatedRoutes.get("/Dashboard", isLoggedIn,loggedInUser,(req, res) => {
    res.json({
        message:'dashboard',
        user:res.locals.user
    })
})

module.exports = AuthenticatedRoutes