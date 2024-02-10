const {Category,SubCategory } = require('../Models/Category');
const Blog  = require('../Models/Blog');
const UploadImage = require('../Utils/UploadImage');
const RemoveFile = require('../Utils/RemoveFile');
const asyncHandler = require('express-async-handler')
const {loadCategories} = require('./HomeController')
const User = require('../Models/Users')
const Comment = require('../Models/Comment')
let articleSlug;
const loadAllCategories = asyncHandler(async()=>{
    const cats = await loadCategories()
    return cats
})
Index = async (req,res)=>{
    const categories = await Category.find({categoryStatus:'Active'}).select("categoryName")
    articles=await Blog.find({blogAuthor:res.locals.user.emailAddress,$or:[{blogStatus: "Published"},{blogStatus:"Pending"}]})
    res.render("Backend/Blog/Index",{articles,categories})
}
GetSubcategories = async (req, res)=>{
    //get the category name 
    const {CategoryName} = req.body
    //check if category exists 
    const category = await Category.findOne({categoryName:CategoryName,categoryStatus:'Active'}).select("categoryName")
    if(category){
        //find the sub categories and return them back 
        const subcategories = await SubCategory.find({CategoryName:category.categoryName,subCategoryStatus:'Active'}).select("SubCategory")
        res.status(200).json({
            subcategories:subcategories
        })
    }else{
        res.status(400).json({
            subcategories:{}
        })
    }
}
GetPostData = async (req, res)=>{
    let author = res.locals.user.emailAddress
    const {ArticleTitle,ArticleCategory,ArticleSubCategory,PublishDate,Content} = req.body
    const {FeaturedImage} = req.files
    const isDoubleExtension = FeaturedImage.name.toString().split(".").length
    if(isDoubleExtension===2){
        //then upload the image
        //check the blog if they have another one with the same title
        const blogexists = await Blog.findOne({Title:ArticleTitle})
        if(blogexists){
            //find another name 
            res.status(422).json({
                status:'error',
                message:'The Title of your Article exists, Please Choose a new title'
            })
        }else{
            // post the data
            //check if the subcategory exists , start with the category
            const category = await Category.findOne({categoryName:ArticleCategory,categoryStatus:'Active'})
            if(category){
                //continue
                // check if subcategory is there
                const subcategory = await SubCategory.findOne({SubCategory:ArticleSubCategory,subCategoryStatus:'Active'})
                if(subcategory){
                    try {
                            const blog = new Blog({
                                Title:ArticleTitle,
                                Slug:ArticleTitle.toString().split(' ').join("-"),
                                FeaturedImage:UploadImage(FeaturedImage),
                                BlogContent:Content,
                                blogCategory:ArticleCategory,
                                blogSubCategory:subcategory.SubCategory,
                                blogAuthor:author,
                                publishDate:PublishDate
                            })
                            await blog.save()
                            res.status(201).json({
                                status:'success',
                                message:'Article Saved successfully. Awaiting Approval'
                            })
                    }catch(e){
                        //log this error and the ip/the one who triggered it
                        res.status(422).json({
                            status:'error',
                            message:'Could not save the Article'
                        })
                    }
                    
                }else{
                    res.status(422).json({
                        status:'error',
                        message:'Invalid Data Submitted'
                    })
                }
            }else{
                res.status(422).json({
                    status:'error',
                    message:'Invalid Data Submitted'
                })
            }
        }
    }else{
        res.status(422).json({
            status:'error',
            message:'The Image does not seem to be valid'
        })
    }
}

GetSingleArticle = asyncHandler(async (req,res)=>{
    const {slug} = req.body
    const userEmail = res.locals.user.emailAddress
    //check if the article exists 
    const article = await Blog.findOne({Slug:slug,blogAuthor:userEmail},{
        publishDate:0,
        updatedAt:0,
        __v:0,
        _id:0,
        blogAuthor:0,
        Slug:0
    })
    res.status(200).json({
        status:'success',
        message:'Article Successfully Fetched',
        data:article,
        stack:''
    })
})
 const WorkOnArticles = asyncHandler(async (req,res)=>{
    const {Slug,ACTION} = req.body

    //always check if the actions are done by the owner 
    const userEmail = res.locals.user.emailAddress
    //filter the actions 
    const article = await Blog.findOne({Slug:Slug,blogAuthor:userEmail})
    if(article){
        if(ACTION==='Delete'){
            //delete the article
            article.blogStatus = 'Deleted'
            await article.save()
            //trigger the error here
            res.status(200).json({
                status:'success',
                message:'Article successfully Deleted',
                redirect:'self'
            })

        }
        else if(ACTION==='Suspend'){
            article.blogStatus = 'Suspended'
            await article.save()
            //trigger the error here
            res.status(200).json({
                status:'success',
                message:'Article successfully Suspended',
                redirect:'self'
            })
        }
        else if(ACTION==='Activate'){
            article.blogStatus = 'Published'
            await article.save()
            //trigger the error here
            res.status(200).json({
                status:'success',
                message:'Article successfully Published',
                redirect:'self'
            })
        }
        else if(ACTION==='Edit'){
            articleSlug = article?.Slug
            res.cookie('Slug',articleSlug,{httpOnly:true,maxAge:1*24*60*60*1000})
            res.status(200).json({
                status:'success',
                message:'Operation Permitted',
                redirect:`/Edit-Article/${article?.Slug}`
            })
        }else{
            //trigger the error here
            res.status(500).json({
                status:'error',
                message:'Unknown Operation Attempted',
                redirect:'self'
            })
        }
    }else{
        res.status(500).json({
            status:'error',
            message:'Unknown Operation Attempted'
        })
    }
 })

 EditArticle = asyncHandler(async(req,res)=>{
    const {Slug} = req.params
    //get the article based on the logged In user
    const userEmail = res.locals.user.emailAddress
    const article=await Blog.findOne({blogAuthor:userEmail,Slug:Slug,$or:[{blogStatus: "Published"},{blogStatus:"Pending"}]})
    if(article.blogStatus==='Pending'){
        //you can edit
        const categories = await Category.find({categoryStatus:'Active'}).select("categoryName")
        res.render('Backend/Blog/EditArticle',{article,categories})
    }
    else if(article.blogStatus==='Published' && res.locals.user.UserRole==='Admin'){
        //also edit
        res.json({article})
    }
    else{
        res.locals.errorMessage = "Unknown Operation"
        res.status(500).redirect("/Articles/User")
    }
    //edit if its pending 
    //edit if you are the admin 
 })
 UpdatePostedArticle = asyncHandler(async(req,res)=>{
    const {ArticleTitle,ArticleCategory,ArticleSubCategory,PublishDate,Content} = req.body
    const articleSlug = req.cookies.Slug
    const blog = await Blog.findOne({Slug:articleSlug,blogAuthor:res.locals.user.emailAddress,blogStatus:"Pending"})
    let imageName = blog.FeaturedImage
    if(req.files){
        const {FeaturedImage} = req.files
        const isDoubleExtension = FeaturedImage.name.toString().split(".").length
        if(isDoubleExtension>2){
        res.status(422).json({
            status:'error',
            message:'The Image does not seem to be valid'
        })
        }else{
            //remove the image
            RemoveFile(blog.FeaturedImage)
            imageName = UploadImage(FeaturedImage)
        }
    }
    if(blog){
        //check the title 
        //check if there i s an article with the same title
        const sametitle = await Blog.findOne({Title:ArticleTitle})
        if(sametitle){
            //check the author
            if(sametitle.blogAuthor === res.locals.user.emailAddress){
            }
            else{
                res.status(422).json({
                    status:'error',
                    message:'Please Choose a different title'
                })
            }
        }
        const category = await Category.findOne({categoryName:ArticleCategory,categoryStatus:'Active'}).select("categoryName")
        if(category){
            const subcategory = await SubCategory.findOne({SubCategory:ArticleSubCategory,subCategoryStatus:'Active'})
            if(subcategory){
                try {
                        blog.Title=ArticleTitle?ArticleTitle:blog.Title,
                        blog.Slug=ArticleTitle?ArticleTitle.toString().split(' ').join("-"):blog.Slug,
                        blog.FeaturedImage=imageName,
                        blog.BlogContent=Content?Content:blog.BlogContent,
                        blog.blogCategory= ArticleCategory?category.categoryName:blog.blogCategory,
                        blog.blogSubCategory=ArticleSubCategory?subcategory.SubCategory:blog.SubCategory,
                        blog.publishDate=PublishDate?PublishDate:blog.publishedDate
                        blog.blogStatus="Pending"
                        await blog.save()
                        res.cookie('Slug','',{httpOnly:true,maxAge:10})
                        res.status(201).json({
                            status:'success',
                            message:'Article Successfully Updated. Awaiting Approval'
                        })
                }catch(e){
                    //log this error and the ip/the one who triggered it
                    res.status(422).json({
                        status:'error',
                        message:'Could not save the Article'
                    })
                }
                
            }else{
                res.status(422).json({
                    status:'error',
                    message:'Invalid Data Submitted'
                })
            }
        }else{
            res.status(422).json({
                status:'error',
                message:'Invalid Data Submitted'
            })
        }
    }else{
        //find another name 
        res.status(422).json({
            status:'error',
            message:'The Title of your Article exists, Please Choose a new title'
        })
        // post the data
        //check if the subcategory exists , start with the category
        
    }

 })
 LoadCategoriesBlog = async (req, res) => {
    //load category Slug
    const {Slug} = req.params
    const category = await Category.findOne({categoryName:Slug,categoryStatus:"Active"})
    const categories = await loadAllCategories()
    if(category){
        const articles = await Blog.find({blogCategory:category.categoryName,blogStatus:"Published"})
        res.render('Frontend/Blog',{category, articles,categories})
    }else{
        res.redirect("/")
    }
 }
 loadSingleBlog = async (req, res) => {
    const {Slug} = req.params
    //get the article from the backend
    const categories = await loadAllCategories()
    const article = await Blog.findOne({Slug:Slug,blogStatus:"Published"})
    //load comments from the backend 
    const comments = await Comment.find({blogTitle:article.Title,commentStatus:"Approved"},{
        _id:0,
        userEmail:0,
        commentStatus:0,
        __v:0
    })
    if(!article){
        res.redirect("/")
    }else{
        const posts = await Blog.find({blogStatus:"Published"})
        res.render('Frontend/Blog_Single',{article,categories,posts,comments})
    }
 }
 const GetpostComment = asyncHandler(async(req,res)=>{
    //check if the comment exists 
    
    //check if the user exists 
    const {email,message,Slug} = req.body
    const user = await User.findOne({emailAddress:email})
    if(user){
        //then continue
        const blog = await Blog.findOne({Slug:Slug,blogStatus:"Published"})
        if(blog){
            //clean input data by escaping the input
            const comment = new Comment({
                blogTitle:blog.Title,
                userName:`${user.FirstName} ${user.LastName}`,
                userEmail:user.emailAddress,
                commentContent:message
            })
            await comment.save()
            res.status(400).json({
                status:'success',
                message:`Comment saved successfully`
            })

        }else{
            res.status(400).json({
                status:'error',
                message:`Try harder ..;`
            })
        }
    }else{
        res.status(400).json({
            status:'error',
            message:`You Must be registered using the email <u style='color:black'>${email}</u> to make a comment`
        })
    }
 })
 getSubCategory = async (req, res)=>{
    //get the subcategory
    //load the categories 
    const categories = await loadAllCategories()
    const {Slug} = req.params
    const subcategory = await SubCategory.findOne({SubCategory:Slug},{
        _id:0,
        __v:0,
    })
    //check the sub categories from the database 
    if(subcategory){
        //load blogs with the sub cateegory 
        const articles = await Blog.find({blogSubCategory:subcategory.SubCategory})
        if(articles){
            res.render('Frontend/Blog_subcategory',{subcategory,categories,articles})
        }else{
            res.redirect(`/Category/${subcategory.CategoryName}`)
        }
    }else{
        res.redirect("/Blog")
    }

 }
 const BlogArticles = async(req,res)=>{
    //load all categories   
    const categories = await loadAllCategories()
    const articles = await Blog.find({blogStatus:"Published"})
    res.render('Frontend/Articles',{categories,articles})
 }
 const getAllComments = asyncHandler(async(req,res)=>{
    const comments = await Comment.find()
    res.render('Backend/Blog/Comments',{comments})
 })
 WorkOnComments = asyncHandler(async(req,res)=>{
    const {ACTION,ID} = req.body
    const comment = await Comment.findById(ID)
    const username = await User.findOne({emailAddress:comment.userEmail}).select("FirstName LastName")
    if(ACTION ==='Approve'){
        comment.commentStatus='Approved'
        comment.userName = `${username.FirstName} ${username.LastName}`
        comment.save()
        res.status(200).json({
            code:200,
            message:'Comment Approved',
            status:'success'
        })
    }else if(ACTION==='Remove'){
        comment.commentStatus='Removed'
        comment.userName = `${username.FirstName} ${username.LastName}`
        comment.save()
        res.status(200).json({
            code:200,
            message:'Comment Removed',
            status:'success'
        })
    }else{
        res.status(400).json({
            code:400,
            message:'Bad Request',
            status:'error'
        })
    }
 })
module.exports ={Index,loadSingleBlog,getSubCategory,LoadCategoriesBlog,UpdatePostedArticle,WorkOnComments,getAllComments,BlogArticles,EditArticle,WorkOnArticles,GetpostComment,GetSingleArticle,GetPostData,GetSubcategories}