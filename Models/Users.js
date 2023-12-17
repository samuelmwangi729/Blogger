const {Schema, model} = require('mongoose')


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
        enum:['Writer','Moderator','Admin','SuperUser','User'],
        default:'User'
    },
    isStaff:{
        enum:['True','False'],
        default:'False'
    },
    AccountStatus:{
        enum:['Verified','Unverified','Suspended','Banned'],
        default:'Unverified'
    },
    Followers:{
        type:Number,
        default:0,
    },
},{timestamps:true})

const User = model('User',UserSchema)
module.exports = User;