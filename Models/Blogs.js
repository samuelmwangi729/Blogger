const {Schema,model} = require('mongoose')
const mongoose = require('mongoose')
let slug = require('mongoose-slug-generator')
mongoose.plugin('slug')
let defaultDate=""
const BlogSchema = new Schema({
    Title:{
        type:String,
    },
    Slug:{
        type:String,
        slug:'Title'
    },
    FeaturedImage:{
        type:String,
        required:[true,'Featured Image is required'],
    },
    BlogContent:{
        type:String,
        required:[true,'Blog Content is required'],
    },
    blogCategory:{
        type:String,
        required:[true,'Category is required'],
    },
    blogStatus:{
        enum:['Published','Pending','Suspended','Removed','Deleted'],
        default:'Pending'
    },
    blogAuthor:{
        type:String,
        required:[true,'Author is required'],
    },
    schedulePublish:{
        type:Boolean,
        enum:['true','false'],
        default:false
    },
    publishDate:{
        type:Date,
        default:defaultDate
    }
},{timestamps:true})
BlogSchema.pre("save",(next)=>{
    this.Slug = this.Title.split(" ").join("-")
    next()
})
BlogSchema.pre("save",(next)=>{
    if(this.schedulePublish===false){
        this.publishDate = defaultDate
    }else{
        this.publishDate = Date.now()
    }
    next()
})
const Blog = model('Blog',BlogSchema)
module.exports = Blog