const express = require('express')
const passport = require('passport')
const {Strategy} = require('passport-google-oauth20')
const cookieParser = require('cookie-parser')
const homeRouter = require('./Routes/Home')
const AuthenticatedRoutes = require('./Routes/AuthenticatedRoutes')
const ConnectToMongo = require('./Utils/DatabaseConnector')
const UploadImage = require('./Utils/UploadImage');
const blogRoutes = require('./Routes/BlogRoutes')
const isGuest = require('./Middlewares/Guest')
const {loadCategories} = require("./Controller/HomeController")
const UserRouter = require('./Routes/UsersRoutes')
const helmet = require('helmet')
const moment = require('moment')
const fileupload = require('express-fileupload')
require('dotenv').config()
const app = express()
const path = require('path')
//let the server run on port 8080
app.get("*", async (req, res,next) =>{
    res.locals.apptitle = process.env.APP_TITLE
    res.locals.categories =[]
    res.locals.errorMessage=""
    res.locals.moment = moment
    next()
})
const AUTH_OPTIONS = {
    callbackURL:"/Authorization/Google/Callback",
    clientID:process.env.GOOGLE_OAUTH_CLIENTID,
    clientSecret:process.env.GOOGLE_OAUTH_SECRET
}
const verifyCallback = (accessToken,refreshToken,profile,done)=>{
    done(null,profile)
}
passport.use(new Strategy(AUTH_OPTIONS,verifyCallback))
app.use(
    helmet({
      contentSecurityPolicy: false,
    })
  );
  app.use(passport.initialize())
app.use(express.urlencoded({extended: true}))
app.use(express.json())
app.use(cookieParser())
app.use(express.static(__dirname + '/Resources'))
app.get("*",isGuest)
app.set('view engine','ejs')
app.set('views','Views')
app.use(homeRouter)
app.use(blogRoutes)
app.use(UserRouter)
app.use((err, req, res, next) =>{
    const status = err?.status?err?.status : ' failed'
    const message = err?.message?err?.message:res.locals.errorMessage
    const stack  = err?.stack

    res.status(500).json({
        status,
        message,
        stack,
        data:''
    })
})
app.post("/Articles/Ckeditor/",fileupload({createParentPath:true}),(req,res)=>{
    UploadImage(req.files.upload)
})
app.post("/Edit-Article/Ckeditor/",fileupload({createParentPath:true}),(req,res)=>{
    UploadImage(req.files.upload)
})
app.use(AuthenticatedRoutes)
const server  = app.listen(
    process.env.PORT || 80,
    () => {
        console.log("=================================")
        ConnectToMongo()
        console.log('Server running on port 80')
        console.log("=================================")
    }
)

app.use(async(req,res)=>{
    // console.log(req.url)
    const categories = await loadCategories()
    res.render('404.ejs',{categories})
})
module.exports = server