const express = require('express')
require('dotenv').config()

//instanciate the express 
const app = express()

const PORT = process.env.PORT || 3000

app.use(express.urlencoded({ extended: true }))
app.use(express.json())

const server = app.listen(PORT,()=>{
    console.log(`Server running on port ${PORT}`)
    //connect to the database after the app has been created
})


modules.export = server 