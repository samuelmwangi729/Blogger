const {Schema,model} = require('mongoose')
const PromotionSchema = new Schema({
    promotionName:{
        type:String,
        required:[true,'Promotion Name is required'],
    },
    promotionImage:{
        type:String,
        required:[true,'Promotion Image is required'],
    },
    promotionContent:{
        type:String,
        required:[true,'Promotion Content is required'],
    },
    promotionType:{
        enum:['Paid','Free','Others'],
        default:'Free'
    },
    promotionStatus:{
        enum:['Active','Inactive'],
        default:'Active'
    },
    clientInformation:{
        type:String,
        required:[true,'Client Information is required'],
    }
},{timestamps:true})

const Promotion = model('Promotion',PromotionSchema)
module.exports = Promotion;