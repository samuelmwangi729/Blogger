const {Schema,model} = require('mongoose')
const ServiceSchema = new Schema({
    Title:{
        type:String,
        required:[true,'The title is required']
    },
    Description:{
        type:String,
        required:[true,'The description is required'],
    },
    ServiceStatus:{
        type:Boolean,
        default:true,
    }
},{timestamps:true})


const Services = model("Services",ServiceSchema)

module.exports = Services