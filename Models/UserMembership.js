const {Schema,model} = require('mongoose')
const UserMembershipSchema = new Schema({
    User:{
        type:Schema.Types.ObjectId,
        ref:'User'
    },
    Membership:{
        type:Schema.Types.ObjectId,
        ref:'Membership'
    },
    expiryDate:{
        type:Date,
        required:[true,'The expiry Date is required']
    },
    membershipStatus:{
        enum:['Active','Expired'],
        default:'Active'
    }
},{timestamps:true})

const UserMembership = model('UserMembership',UserMembershipSchema)
module.exports = UserMembership

