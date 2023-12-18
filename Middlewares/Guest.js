
isGuest = (req,res,next)=>{
    const token = req.cookies.jwt
    if(token){
        res.locals.isAuthenticated = true
    }else{
        res.locals.isAuthenticated=false
    }
    next()
}
module.exports = isGuest