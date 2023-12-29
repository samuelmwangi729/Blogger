const {Schema,model} = require('mongoose')

const ProfileSchema = new Schema({
    userEmail:{
        type: String,
        required: [true,'user email address is required']
    },
    username:{
        type:String,
        required:[true,'Username is required'],
    },
    twitter:{
        type:String,
        required:[true,'X Username is required'],
    },
    Skills:{
        type:String,
        required:[true,'Skills required'],
    },
    Country:{
        type:String,
        required:[true,'Country is required'],
    },
    DoB:{
        type:Date,
        required:[true,'DoB is required'],
    },
    ProfilePicture:{
        type:String,
        required:[true,'Profile Picture is required'],
    },
    Bio:{
        type:String,
        required:[true,'Profile Bio is required'],
    },
},{timestamps:true})
const Profile = model("Profile",ProfileSchema)
module.exports = Profile