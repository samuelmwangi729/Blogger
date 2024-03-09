const {Router} = require('express')
const {isLoggedIn,loggedInUser,isLoggedInApi} = require('../Middlewares/Authentication')
const {ViewUsers,DeactivateUser,BanUser,ActivateUser,ResetUser,makeAdmin,removeAdmin} = require("../Controller/Users")
UserRouter = Router()

UserRouter.get("/api/users",isLoggedIn,loggedInUser,ViewUsers)
.get("/deactivate/user/:userId",isLoggedIn,loggedInUser,DeactivateUser)
.get("/activate/user/:userId",isLoggedIn,loggedInUser,ActivateUser)
.get("/ban/user/:userId",isLoggedIn,loggedInUser,BanUser)
.get("/reset/user/:email",isLoggedIn,loggedInUser,ResetUser)
.get("/makeAdmin/user/:userId",isLoggedIn,loggedInUser,makeAdmin)
.get("/removeAdmin/user/:userId",isLoggedIn,loggedInUser,removeAdmin)

module.exports = UserRouter