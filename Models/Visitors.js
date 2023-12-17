const {Schema, model} = require('mongoose')
const VisitorSchema = new Schema({
    ipAddress:{
        type: 'string',
        required: [true, 'IpAddress is required']
    },
    Browser:{
        type:'string',
        required: [true, 'Browser is required']
    },
    VisitorID:{
        type:'string',
        required: [true, 'VisitorID is required']
    },
    UserEmail:{
        type:'string',
        default:""
    }
},{timestamps:true})
const Visitor = model('Visitor',VisitorSchema)
module.exports = Visitor