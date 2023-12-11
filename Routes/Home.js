const {Router} = require('express')
const {Home} = require('../Controller/HomeController.js')

const homeRouter = Router()

homeRouter.get('/',Home)
.get('/About',(req,res)=>{
    res.render('Frontend/About')
})
.get("/Contact",(req,res)=>{
    res.render('Frontend/Contact')
})

module.exports = homeRouter