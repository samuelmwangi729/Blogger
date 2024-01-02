const  bcrypt = require('bcrypt')
const User = require("../Models/Users")
const sendEmail = require('../Utils/EmailSender')
const generateJwt = require('../Utils/generateToken')
const generateRandom =  require('../Utils/genRandom')
const Token = require('../Models/Tokens')
const {Category,SubCategory} = require('../Models/Category')
GetSubCategories = async(categoryName)=>{
    let sbr =[]
    let sojb={}
    const subcategories = await SubCategory.find({CategoryName:categoryName,subCategoryStatus:'Active'},{
        _id:0,
        subCategoryStatus:0,
        __v:0
    })
    if(subcategories.length>0){
        for(let i=0;i<subcategories.length;i++){
            sbr.push(subcategories[i].SubCategory)
        }
        let sojb={...sbr}
        return sbr
    }else{
        return sbr
    }
}
const loadCategories = async ()=>{
    const categories = await Category.find({categoryStatus:'Active'},{_id:0,
        categoryIcon:0,
        categoryType:0,
        categoryStatus:0,
        createdAt:0,
        updatedAt:0,
        __v:0
    }).select("categoryName")
    for(let i=0;i<categories.length;i++){
        //check if the category has subcategories
        let subs =await  GetSubCategories(categories[i].categoryName)
        categories[i].set('subcategories',subs,{strict:false})
    }
    return categories
}
const Home = async (req, res) => {
    const categories = await loadCategories()
    res.render('Frontend/home',{categories})
}
const About = async (req, res) => {
    const categories = await loadCategories()
    res.render('Frontend/About',{categories})
}
const Contact = async (req, res) => {
    const categories = await loadCategories()
    res.render('Frontend/Contact',{categories})
}
const Login = async (req, res) => {
    const categories = await loadCategories()
    res.render('Frontend/Login',{categories})
}
const Logout = async (req, res) => {
    res.cookie("jwt","",{maxAge:10})
    res.redirect('/')
}
const Reset = async (req, res) => {
    const categories = await loadCategories()
    res.render('Frontend/Reset',{categories})
}
const Passwords = async (req, res) => {
    const categories = await loadCategories()
    res.render('Frontend/Passwords',{categories})
}
const Register = async (req, res) => {
    const categories = await loadCategories()
    res.render('Frontend/Register',{categories})
}
Register_user = async (req, res) =>{
    let firstName = req.body.firstName
    let lastName = req.body.lastName
    let emailAddress = req.body.emailAddress
    let password = req.body.password
    let confirmPassword = req.body.confirmPassword
    //check if the passwords match
    let isPassSame = check_Pass(password,confirmPassword)
    if(isPassSame){
        //check if the user already exists
        const user  = await User.findOne({ emailAddress: emailAddress})
        if(user){
            //th user exists 
            res.status(400).json({
                status:'error',
                message:'User already Registered. Use a different email address',
                code:400
            })
        }else{
            //create the user 
            const newUser = new User({
                FirstName:firstName,
                LastName:lastName,
                emailAddress:emailAddress,
                Password:await getEncryptedPassword(password),
            })
            await newUser.save()
            console.log(newUser)
            res.status(200).json({
                status:'success',
                message:'User created successfully',
            })
        }
    }else{
        res.status(400).json({
            status:'error',
            message:'Passwords Do not match',
        })
    }
}
check_Pass = (password, confirmPassword) => {
    if(password===confirmPassword) {
        return true
    }else{
        return false
    }
}
const getEncryptedPassword = async(pass)=>{
    const salt = await bcrypt.genSalt(10)
    let newPass = await bcrypt.hash(pass,salt)
    return newPass
}
Login_User = async (req,res)=>{
    console.log(req.body)
    const{email,Password,RememberMe}  = req.body
    const login_Status = await User.Login(email,Password)
    if(login_Status){
        //create the jwt token
        let cookieDays ;
        if(RememberMe==='on'){
            //cookie lasts for 30 days
            cookieDays=30
        }else{
            //cookie lasts for 3 days
            cookieDays=3
        }
        const token = generateJwt(email,cookieDays)
        res.cookie('jwt',token,{httpOnly:true,maxAge:parseInt(cookieDays)*24*60*60*1000})
        res.status(200).json({
            status:'success',
            message:'Login Successfull. Redirecting....'
        })
    }else{
        res.status(400).json({
            status:'error',
            message:'Incorrect Details'
        })
    }
}
get_reset_password = async(req,res)=>{
    const {email} = req.body
    //check if the user exists 
    const user = await User.findOne({emailAddress:email})
    const rtoken = generateRandom(6)
    if(user){
        //then send the email
        //save the token to the database 
        const newToken = new Token({
            token:rtoken,
            user:email,
            tokenType:'Reset',
        })
        sendEmail(email,"Reset Your Password",rtoken,"Reset")
        await newToken.save()
        res.status(200).json({
            status:'success',
            message:'If the Account exists, An email has been sent with your reset password'
        })
    }else{
        res.status(400).json({
            status:'error',
            message:'Unknown Error Occurred'
        })
    }
}
GetToken = async(req, res)=>{
    const {userToken} = req.params
   //check if the token exists  in the database
   const tokenExists = await Token.findOne({
    token:userToken,
    Status:'Active'
   }) 
   if(!tokenExists){
    res.redirect("/")
   }
   else{
    res.cookie('Resettoken',userToken,{httpOnly:true,maxAge:0.1*24*60*60*1000})
    res.redirect("/UpdatePassword")
   }
}
getNewPasswords = async(req, res)=>{
    const ResetToken = req.cookies.Resettoken
    const {Password,confirmPassword} = req.body
    const tokenActive = await Token.findOne({token:ResetToken,Status:'Active'})
    if(!tokenActive){
        res.status(400).json({
            status:'error',
            message:'Password Could not be updated. Try resetting Again'
        })
    }
    else{
        const user = await User.findOne({emailAddress:tokenActive.user})
        if(tokenActive){
            if(check_Pass(Password,confirmPassword)){
                //the two passwords are the same
                //update them
                user.Password = await getEncryptedPassword(Password)
                await user.save()
                tokenActive.Status="Used"
                tokenActive.save()
                res.cookie('Resettoken','',{httpOnly:true,maxAge:10})
                res.status(200).json({
                    status:'success',
                    message:'Password Updated'
                })
            }else{
                res.status(422).json({
                    status:'error',
                    message:'Your passwords do not match'
                })
            }
        }else{
            res.status(400).json({
                status:'error',
                message:'Unknown Error Occurred'
            })
        }
    }
    
}

module.exports = { Home, About, Contact, Login, Logout, Reset, Register, Register_user,GetToken,get_reset_password,Login_User,getNewPasswords, Passwords,loadCategories }