const {schema,model} = require('mongoose')
const slug = require('mongoose-slug-generator')
const generateRandom = require("../Utils/genRandom.js")
require('dotenv').config()
const mongoose = require('mongoose')
mongoose.plugin('slug')
const ProductSchema = new Schema({
    productName:{
        type:String,
        required:[true,'Product Name is required'],
    },
    productSlug:{
        type:String,
        slug:'productName'
    },
    productImage:{
        type:String,
        required:[true,'Product Image is required'],
    },
    featuredImages:{
        type:Array,
        default:[''],
    },
    productCategory:{
        type:String,
        required:[true,'Category is required'],
    },
    productSubCategory:{
        type:String,
        required:[true,'Sub Category is required'],
    },
    productBrand:{
        type:String,
        required:[true,'Brand is required'],
    },
    productContent:{
        type:String,
        required:[true,'Product Content is required'],
    },
    productType:{
        enum:['Featured','Premium',''],
        default:''
    },
    productPrice:{
        type:Number,
        required:[true,'Product Price is required'],
    },
    productStatus:{
        enum:['Active','Pending','Deleted','Removed'],
        default:'Pending'
    },
    SKU:{
        type:String,
        required:[true,'SKU is required'],
    },
    clientInformation:{
        type:String,
        required:[true,'Client Information is required'],
    },
    itemStore:{
        type:Number,
        required:[true,'Number of Items is required'],
    },
    seller:{
        type:String,
        required:[true,'Seller is required'],
    }
})
ProductSchema.pre("save",(next)=>{
    this.productSlug = this.productName.split(" ").join("-")
    this.SKU = `${process.env.SKU_PRE}-${generateRandom(10)}`
    next()
})