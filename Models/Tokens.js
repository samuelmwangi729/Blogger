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
        type:String,
        enum:['Active', 'Expired','Used' ],
        default:'Active'
    },
    tokenType:{
        type:String,
        enum:['Verification', 'Reset','Withdraw','Others'],
        required: [true,'Token type is required']
    },
},{timestamps:true})

const Token = model('Token',TokenSchema)
module.exports = Token