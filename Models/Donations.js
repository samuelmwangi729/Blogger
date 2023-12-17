const {Schema, model} = require('mongoose')
const DonationSchema = new Schema({
    User:{
        type:String,
        required:[true,'This field is required'],
    },
    DonationAmount:{
        type:String,
        required:[true,'This field is required']
    },
    DonationCurrency:{
        type:String,
        required:[true,'This field is required'],
        default:'usd'
    },
    DonationStatus:{
        enum:['Received','Pending'],
        default:'Pending'
    }
},{
    timestamps:true
})

const Donation = model('Donation',DonationSchema)
module.exports = {
    Donation
}