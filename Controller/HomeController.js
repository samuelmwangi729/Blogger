const Home = async (req,res)=>{
    res.render('Frontend/home')
}
const About = async (req,res)=>{
    res.render('Frontend/About')
}
const Contact = async (req,res)=>{
    res.render('Frontend/Contact')
}   
const Login = async (req,res)=>{
    res.render('Frontend/Login')
}
const Logout = async (req,res)=>{
    res.render('Frontend/Logout')
}
const Reset = async (req,res)=>{
    res.render('Frontend/Reset')
}
const Passwords = async (req,res)=>{
    res.render('Frontend/Passwords')
}
const Register = async (req,res)=>{
    res.render('Frontend/Register')
}
module.exports = {Home,About,Contact,Login,Logout,Reset,Register,Passwords}