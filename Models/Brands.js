const {Schema,model} = require('mongoose')
const BrandSchema = new Schema({
    BrandName:{
        type:String,
        required: [true, 'Brand Name is required']
    },
    BrandImage:{
        type:String,
        required: [true, 'Brand Image is required']
    },
    BrandCategory:{
        type:String,
        required: [true, 'Brand Category is required']
    },
    BrandSubCategory:{
        type:String,
        required: [true, 'Brand SubCategory is required']
    },
    BrandStatus:{
        enum:['Active', 'Inactive' ],
        default:'Active'
    }
},{timestamps:true})

const Brand = model('Brand',BrandSchema)
module.exports = Brand