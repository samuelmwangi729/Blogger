const {Schema,model} = require('mongoose')

const CategorySchema = new Schema({
    categoryName:{
        type:String,
        required:[true,'Category Name is required'],
    },
    categoryIcon:{
        type:String,
        required:[true,'Category Icon is required'],
    },
    categoryType:{
        type:String,
        enum:['Blog','Product','Others'],
        default:'Blog'
    },
    categoryStatus:{
        type:String,
        enum:['Active','Inactive'],
        default:'Active'
    },
},{timestamps:true})

const SubCategorySchema = new Schema({
    CategoryName:{
        type:String,
        required:[true,'Category Name is required'],
    },
    SubCategory:{
        type:String,
        required:[true,'SubCategory  is required'],
    },
    subCategoryStatus:{
        type:String,
        enum:['Active','Inactive'],
        default:'Active'
    },
 })
const Category = model('Category',CategorySchema)
const SubCategory = model('SubCategory',SubCategorySchema)
module.exports = {Category,SubCategory};