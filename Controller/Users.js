const User = require("../Models/Users")
const asyncHandler = require('express-async-handler')
const sendEmail =  require("../Utils/ActionEmail")
const {loadCategories} = require('./HomeController')
const { response } = require("express")
ViewUsers = async(req,res)=>{
    const message=""
    const users = await User.find({},{
        Password: 0,
        createdAt: 0,
        updatedAt: 0,
        __v: 0
    })
    res.render('Backend/Users/All.ejs',{users,message})
}
DeactivateUser = asyncHandler (async(req,res)=>{
    let message=""
    const userId = req.params.userId
    const user = await User.findById(userId)
    if(res.locals.user.emailAddress === user.emailAddress){
        //you can not deactivate yourself
        res.redirect("/api/users")
    }
    else{
        if(user){
            user.AccountStatus = 'Suspended'
            user.save()
            //send an email notification on the user on account status
            message = "It has been noted that your account has violated the terms of use of the platform. It is within our powers" +
             "to take action and therefore we have decided to deactivate your account. If you think this is a mistake, kindly get in touch with us"
            sendEmail(user.emailAddress,`Suspension of Techpoint Account for ${user.FirstName} ${user.LastName}`,'Suspension of Your Account',message)
        }else{
            message=" Unknown Error Occured"
        }
        res.redirect("/api/users")
    }
    
})
BanUser = asyncHandler (async(req,res)=>{
    let message=""
    const userId = req.params.userId
    const user = await User.findById(userId)
    if(user){
        user.AccountStatus = 'Banned'
        user.save()
        message = "It has been noted that your account has violated the terms of use of the platform. It is within our powers" +
         " to take action and therefore we have decided to ban you from accessing your registered account. If you think this is a mistake, kindly get in touch with us"
        sendEmail(user.emailAddress,`Suspension of Techpoint Account for ${user.FirstName} ${user.LastName}`,'Banning of Your Account',message)
    }else{
        message=" Unknown Error Occured"
    }
    res.redirect("/api/users")
    
})
ActivateUser = asyncHandler (async(req,res)=>{
    const userId = req.params.userId
    const user = await User.findById(userId)
    if(user){
        user.AccountStatus = 'Unverified'
        user.save()
        message = "It has been noted that your account had been restricted for violating the terms of use of the platform. It was within our powers" +
         " to take action and therefore we had to restrict your account for further investigations. We have lifted the restriction and ykou can successfully "+
         " continue using your account"
        sendEmail(user.emailAddress,`Good News to  ${user.FirstName} ${user.LastName}`,'Activation of Your Account',message)
    }else{
        message=" Unknown Error Occured"
    }
    res.redirect("/api/users")
})
ResetUser = async(req, res)=>{
    const userEmail = req.params.email
    const categories = await loadCategories()
    res.render('Frontend/Reset',{categories,userEmail})
}
makeAdmin = asyncHandler(async(req,res)=>{
    const userId = req.params.userId
    const user = await User.findById(userId)
    if(user){
        user.UserRole = 'Admin'
        user.isStaff = 'True'
        user.save()
        message = "You are now an Administrator of our platform. You will now be able to view advanced functions of the website"
        sendEmail(user.emailAddress,`Promotion of Techpoint Account for ${user.FirstName} ${user.LastName}`,'Promotion of Your Account',message)
    }else{
        message=" Unknown Error Occured"
    }
    res.redirect("/api/users")
})
removeAdmin = asyncHandler(async(req,res)=>{
    const userId = req.params.userId
    const user = await User.findById(userId)
    if(user){
        user.UserRole = 'NormalUser'
        user.isStaff = 'False'
        user.save()
        message = "You are not an Administrator of our platform anymore. You will not be able to view advanced functions of the website"
        sendEmail(user.emailAddress,`Demotion of Techpoint Account for ${user.FirstName} ${user.LastName}`,'Demotion of Your Account',message)
    }else{
        message=" Unknown Error Occured"
    }
    res.redirect("/api/users")
})
module.exports = {ViewUsers,DeactivateUser,BanUser,ResetUser,ActivateUser,makeAdmin,removeAdmin}