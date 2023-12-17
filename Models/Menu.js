const {Schema, model, default: mongoose} = require('mongoose')
const slug = require('mongoose-slug-generator')
mongoose.plugin('slug')
const menuSchema =  new Schema({
    menuName:{
        type:String,
        required:[true,'The Name is required']
    },
    menuSlug:{
        type:String,
        slug:'menuName'
    },
    Status:{
        enum:['Active','Pending','Suspended','Deleted'],
        default:'Active'
    },
    menuLink:{
        type:String,
        required:[true,'The Link is required']
    }
},{timestamps:true})
const subMenuSchema = new Schema({
    subMenu:{
        type:String,
        required:[true,'The Name is required']
    },
    menuName:{
        type:String,
        required:[true,'The Name is required']
    },
    Status:{
        enum:['Active','Pending','Suspended','Deleted'],
        default:'Active'
    }
},{timestamps:true})
menuSchema.pre("save",(next)=>{
    this.menuSlug = this.menuName.split(" ").join("-")
    next()
})
const Menu = model('Menu',menuSchema)
const SubMenu = model('SubMenu',subMenuSchema)
module.exports = {Menu,SubMenu}