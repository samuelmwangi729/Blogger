const UploadImage = require("../Utils/UploadImage.js")
const Profile = require("../Models/Profile.js")
const User = require("../Models/Users.js")
const Token = require('../Models/Tokens.js')
const sendEmail = require("../Utils/EmailSender.js")
const generateRandom =  require('../Utils/genRandom.js')
const Index = async (req, res)=>{
    res.render('Backend/Index')
}

ProfileController = async(req,res)=>{
    const profile = await Profile.findOne({userEmail:res.locals.user.emailAddress})
    res.render('Backend/Profile',{profile})
}
const getProfileData = async(req,res)=>{
    const {DisplayName,XProfile,Skills,Country,DoB,Bio} = req.body
    const ProfilePicture = UploadImage(req.files.ProfilePicture)  
    try{
        //check if the profile existed 
        const profileExists = await Profile.findOne({userEmail:res.locals.user.emailAddress})
        console.log(profileExists)
        if(profileExists){
            //update the profile 
            profileExists.userEmail = res.locals.user.emailAddress
            profileExists.username = DisplayName
            profileExists.twitter = XProfile
            profileExists.Skills = Skills
            profileExists.Country = Country
            profileExists.DoB =DoB
            profileExists.ProfilePicture =ProfilePicture
            profileExists.Bio = Bio

            await profileExists.save()
            res.status(200).json({
                status:'success',
                message:'Profile successfully Updated',
                code:201,
            })
        }else{
            //create the profile
            const userProfile = new Profile({
                userEmail: res.locals.user.emailAddress,
                username:DisplayName,
                twitter:XProfile,
                Skills:Skills,
                Country:Country,
                DoB:DoB,
                ProfilePicture:ProfilePicture,
                Bio:Bio
            })
            await userProfile.save()
            res.status(200).json({
                status:'success',
                message:'Profile saved successfully',
                code:201
            })
        }
    } catch(err){
        res.status(400).json({
            status:'error',
            message:'Profile not saved',
            code:400
        })
    }
}
VerifyAccount = async(req,res)=>{
    const email = res.locals.user.emailAddress
    const user = await User.findOne({emailAddress:email})
    const vtoken = generateRandom(6)
    const newToken = new Token({
        token:vtoken,
        user:email,
        tokenType:'Verification',
    })
    await newToken.save()
    sendEmail(email,"Verify Your Account",vtoken,"Verification")
    res.render("Backend/Verify")
}
const getVerificationToken = async(req,res)=>{
    const {verificationToken} = req.params
    console.log(verificationToken)
    console.log(req.url)
    //check if the token exists  in the database
    const tokenExists = await Token.findOne({
     token:verificationToken,
     Status:'Active'
    }) 
    if(!tokenExists){
     res.redirect("/")
    }
    else{
     //get the user email from the token, check if the email match the logged in user 
     const user = await User.findOne({emailAddress:tokenExists.user})
     user.AccountStatus="Verified"
     await user.save()
     tokenExists.Status="Used"
     await tokenExists.save()
     res.redirect("/User/Profile")
    }
}
module.exports = {Index,getProfileData,ProfileController,getVerificationToken,VerifyAccount}