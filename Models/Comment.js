const {Schema,model} = require('mongoose')

const CommentSchema = new Schema({
    blogTitle:{
        type:'String',
        required:[true,'Blog title is required'],
    },
    userEmail:{type:'String',required:[true,'User email is required']},
    userName:{
        type:'String',
        required:[true,'User name is required'],
        default:null,
    },
    commentContent:{type:'String',required:[true,'Comment content is required']},
    commentStatus:{
        type:'String',
        enum:[
            'Pending','Approved','Removed'
        ],
        default:'Pending'
    }
})

const Comment = model('Comment',CommentSchema)
module.exports = Comment