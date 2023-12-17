const {Schema,model} = require('mongoose')

const TokenSchema =  new Schema({
    token:{
        type:String,
        required: [true, 'Token is required']
    },
    user:{
        type:String,
        required: [true, 'User is required']
    },
    Status:{
        enum:['Active', 'Expired','Used' ],
        default:'Active'
    } 
},{timestamps:true})

const Token = model('Token',TokenSchema)
module.exports = Token