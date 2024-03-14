require('dotenv').config()
const jwt  = require('jsonwebtoken')
const User = require('../Models/Users')
const url = require('url')
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
isLoggedInApi = async(req,res,next)=>{
    //check if the token exists 
    let token = req.cookies.jwt
    if(token){
        //verify if the token is genuine
        verifyTKNApi(token,req,res,next)
    }else{
        res.json({
            "message":"UnAuthorised Request"
        })
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
verifyTKNApi = async(tkn, req,res,next)=>{
    jwt.verify(tkn,process.env.TOKEN_SECRET_KEY,(err,decodedToken)=>{
        if(err){
            res.cookie("jwt","",{maxAge:10})
            res.json({
                message:"UnAuthorised Request"
            })
        }else{
            next()
        }
    })
}
verifyTKN = async(tkn, req,res,next)=>{
    jwt.verify(tkn,process.env.TOKEN_SECRET_KEY,(err,decodedToken)=>{
        if(err){
            res.cookie("jwt","",{maxAge:10})
            res.locals.errorMessage=""
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
            //check if the user is verified
            //if not, redirect here 
            res.locals.user = user
            res.locals.errorMessage=""
            if(user.AccountStatus==='Verified'){
                next()
            }else if(user.AccountStatus==='Banned'){
                res.redirect('/Account/Banned')
            }
            else if(user.AccountStatus==='Suspended'){
                res.redirect('/Account/Suspended')
            }
            else{
                if(req.url==="/Verify/Account"){
                    next()
                }
                else{
                    res.redirect("/Verify/Account")
                }
            }
        }
    })
}
module.exports = {isLoggedIn,loggedInUser,isLoggedInApi}