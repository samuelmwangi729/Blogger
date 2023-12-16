const {Router} = require('express')
const {Home,About,Contact,Login,Logout,Reset,Register,Passwords} = require('../Controller/HomeController.js')

const homeRouter = Router()

homeRouter.get('/',Home)
.get('/About',About)
.get('/Logout',Logout)
.get('/Contact',Contact)
.get('/Login',Login)
.get('/Register',Register)
.get('/Reset',Reset)
.get('/UpdatePassword',Passwords)
module.exports = homeRouter