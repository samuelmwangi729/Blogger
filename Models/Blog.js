const {Schema,model} = require('mongoose')
const mongoose  = require('mongoose')
const slug = require('mongoose-slug-generator')
mongoose.plugin(slug)
const BlogSchema = new Schema({
    Title:{
        type:String,
    },
    Slug:{
        type:String,
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
        type:String,
        enum:['Published','Pending','Suspended','Removed','Deleted'],
        default:'Pending'
    },
    blogAuthor:{
        type:String,
        required:[true,'Author is required'],
    },
    publishDate:{
        type:Date,
        default:Date.now()
    }
},{timestamps:true})
const Blog = model('Blog',BlogSchema)
module.exports = Blog