const {Schema,models}  = require('mongoose')

const MessagSchema = new Schema({
    messageTitle:{
        type:String,
        required: [true, 'Title is required']
    },
    messageBody:{
        type:String,
        required: [true, 'Body is required']
    },
    messageSender:{
        type:String,
        required: [true, 'Sender is required']
    },
    messageReceiver:{
        type:String,
        required: [true, 'Receiver is required']
    },
    MessageStatus:{
        enum:['success', 'failed', ],
        default:'success'
    }
},{timestamps:true})

const Message = model('Message',MessagSchema)
module.exports = Message