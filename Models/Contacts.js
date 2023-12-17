const {Schema, model}  = require('mongoose')

const ContactSchema = new Schema({
    phone:{
        type:Array
    },
    location:{
        type:Array
    },
    email:{
        type:Array
    },
},{timestamps:true})


const Contact = model('Contact',ContactSchema)
module.exports = Contact