require('dotenv').config()
const jwt  = require('jsonwebtoken')
const User = require('../Models/Users')

isLoggedIn = async(req,res,next)=>{
    //check if the token exists 
    let token = req.cookies.jwt
    if(token){
        //verify if the token is genuine
        verifyTKN(token,req,res,next)
    }else{
        res.redirect("/")
    }
}

loggedInUser = async(req,res,next)=>{
let token = req.cookies.jwt
if(token){
    VerifyAndGetUser(token,req,res,next)
}else{
    res.locals.user=null;
    next()
}
}

verifyTKN = async(tkn, req,res,next)=>{
    jwt.verify(tkn,process.env.TOKEN_SECRET_KEY,(err,decodedToken)=>{
        if(err){
            res.cookie("jwt","",{maxAge:10})
            res.redirect("/")
        }else{
            next()
        }
    })
}
VerifyAndGetUser = async(tkn, req,res,next)=>{
    jwt.verify(tkn,process.env.TOKEN_SECRET_KEY,async (err,decodedToken)=>{
        if(err){
            res.cookie("jwt","",{maxAge:10})
            res.redirect("/")
        }else{
            const userId = decodedToken.uniqueKey
            const user = await User.findOne({emailAddress:userId},{
                Password:0,
                _id:0,
                createdAt:0,
                updatedAt:0,
                __v:0
            })
            res.locals.user = user
            next()
        }
    })
}
module.exports = {isLoggedIn,loggedInUser}