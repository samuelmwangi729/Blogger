const mongoose = require('mongoose');
require('dotenv').config()
//connect to the mongo database
const ConnectToMongo = async ()=>{
    let dbUrl =""
    if(process.env.PROJECT_URL === 'production'){
        dbUrl = process.env.PROD_DB_URL
    }else{
        dbUrl = process.env.DEV_DB_URL
    }
    //chekc the environment 
    try{
        await mongoose.connect(dbUrl);
        console.log('Connected to MongoDB');
    }catch(err){
        console.log(err);
    }
}

module.exports = ConnectToMongo;