const express = require('express')
const fileupload = require('express-fileupload')
const cookieParser = require('cookie-parser')
const homeRouter = require('./Routes/Home')

const app = express()
//let the server run on port 8080

app.use(express.urlencoded({extended: true}))
app.use(express.json())
app.use(cookieParser())
app.use(fileupload())
app.set('view engine','ejs')
app.set('views','Views')
app.use(homeRouter)
app.use(express.static('Resources'))
const server  = app.listen(
    process.env.PORT || 8080,
    () => {
        console.log('Server running on port 8080')
    }
)

app.use((req,res)=>{
    res.render('404.ejs')
})
module.exports = server