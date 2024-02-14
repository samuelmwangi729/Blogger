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
    Validity:{
        type:Number,
        default:30
    }
},{timestamps:true})
const MembershipBenefitSchema = new Schema({
   membershipType:{
    type:String,
    required:[true,'This field is required ']
   },
   Benefits:{
    type:String,
    required:[true,'The benefits field is required']
   },
   BenefitStatus:{
    type:Boolean,
    default:false
   }
},{timestamps:true})
const Membership = model('Membership',MembershipSchema)
const MembershipBenefits = model('MembershipBenefits',MembershipBenefitSchema)
module.exports = {
    Membership,MembershipBenefits
}