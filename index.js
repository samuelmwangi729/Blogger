const express = require('express')
const cookieParser = require('cookie-parser')
const homeRouter = require('./Routes/Home')
const AuthenticatedRoutes = require('./Routes/AuthenticatedRoutes')
const ConnectToMongo = require('./Utils/DatabaseConnector')
const blogRoutes = require('./Routes/BlogRoutes')
const isGuest = require('./Middlewares/Guest')
const {loadCategories} = require("./Controller/HomeController")
require('dotenv').config()
const app = express()
const path = require('path')
//let the server run on port 8080
app.get("*", async (req, res,next) =>{
    res.locals.apptitle = process.env.APP_TITLE
    res.locals.categories =[]
    next()
})
app.use(express.urlencoded({extended: true}))
app.use(express.json())
app.use(cookieParser())
app.use(express.static(__dirname + '/Resources'))
app.get("*",isGuest)
app.set('view engine','ejs')
app.set('views','Views')
app.use(homeRouter)
app.use(blogRoutes)
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
    const categories = await loadCategories()
    res.render('404.ejs',{categories})
})
module.exports = server