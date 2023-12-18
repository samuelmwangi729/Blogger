const {Schema, model} = require('mongoose')
const bcrypt = require('bcrypt')

const UserSchema = new Schema({
    FirstName:{
        type:String,
        required:[true,'First Name is required'],
    },
    LastName:{
        type:String,
        required:[true,'Last Name is required'],
    },
    emailAddress:{
        type:String,
        required:[true,'Email Address is required'],
    },
    UserRole:{
        type:String,
        enum:['Writer','Moderator','Admin','SuperUser','NormalUser'],
        default:'NormalUser'
    },
    isStaff:{
        type:String,
        enum:['True','False'],
        default:'False'
    },
    AccountStatus:{
        type:String,
        enum:['Verified','Unverified','Suspended','Banned'],
        default:'Unverified'
    },
    Followers:{
        type:Number,
        default:0,
    },
    Password:{
        type:String,
        required:[true,'Password is required'],
    }
},{timestamps:true})
UserSchema.statics.Login = async (username,password)=>{
    const userExists = await User.countDocuments({emailAddress:username})
    if(userExists>0){
        const user = await User.findOne({emailAddress:username})
        const isPassSameUser = await bcrypt.compare(password,user.Password)
        return isPassSameUser
    }else{
        return false
    }
}
const User = model('User',UserSchema)
module.exports = User;