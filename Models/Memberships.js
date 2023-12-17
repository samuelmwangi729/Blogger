const {Schema,model} = require('mongoose')
const MembershipSchema = new Schema({
    MembershipType:{
        type:String,
        required:[true,'This field is required']
    },
    MembershipAmount:{
        type:String,
        required:[true,'This field is required']
    },
    Benefits:{
        type:Array,
        default:[]
    },
    Validity:{
        type:Number,
        default:30
    }
},{timestamps:true})

const Membership = model('Membership',MembershipSchema)
module.exports = {
    Membership
}