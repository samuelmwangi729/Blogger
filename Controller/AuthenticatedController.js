const Index = async (req, res)=>{
    res.render('Backend/Index')
}

Profile = async(req,res)=>{
    res.render('Backend/Profile')
}
const getProfileData = async(req,res)=>{
    const {DisplayName,XProfile,Skills,Country,DoB,Bio} = req.body
    const ProfilePicture = req.files
    console.log(req.body)
}
module.exports = {Index,getProfileData,Profile}