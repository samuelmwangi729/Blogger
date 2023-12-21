const Index = async (req, res)=>{
    res.render('Backend/Index')
}

Profile = async(req,res)=>{
    res.render('Backend/Profile')
}
module.exports = {Index,Profile}