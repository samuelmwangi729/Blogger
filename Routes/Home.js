const {Router} = require('express')
const {Home,About,Contact,Suspended,Login,Logout,Reset,Banned,Register,Passwords,getNewPasswords,Register_user,Login_User,get_reset_password,GetToken} = require('../Controller/HomeController.js')
const passport = require('passport')
const isGuest = require('../Middlewares/Guest.js')
const homeRouter = Router()
homeRouter.get('/',Home)
.get('/About',About)
.get('/Logout',Logout)
.get('/Contact',Contact)
.get('/Login',Login)
.get('/Register',Register)
.get('/Reset',Reset)
.get('/UpdatePassword',Passwords)
.post("/user-Register",Register_user)
.post("/login-user",Login_User)
.post("/reset-password",get_reset_password)
.get("/Password-Reset-Token/:userToken",GetToken)
.post("/get-new-posted-password",getNewPasswords)
.get("/Account/Banned",Banned)
.get("/Account/Suspended",Suspended)
.get("/Authentication/Google",passport.authenticate('google', { scope: ['profile'] }),(req,res)=>{
    
})
.get("/Authentication/Google/Callback",
passport.authenticate('google',{
    failureRedirect: '/Login',
    successRedirect:'/Dashboard'
}),(req,res)=>{
    console.log('callback done')
})

module.exports = homeRouter