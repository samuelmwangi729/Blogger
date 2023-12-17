const {Schema, model} = require('mongoose')

//this model will track the user who logged in and when using their ip address
const LoginLogSchema = new Schema({
    User:{
        type:String,
        required:[true,'This field is required'],
    },
    IpAddress:{
        type:String,
        required:[true,'This field is required']
    },
    LoginStatus:{
        type:String,
        required:[true,'This field is required']
    }
},{timestamps:true})

const LoginLog = model('LoginLog',LoginLogSchema)
module.exports = {
    LoginLog
}