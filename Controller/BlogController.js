const {Category,SubCategory } = require('../Models/Category');
const Blog  = require('../Models/Blog');
const UploadImage = require('../Utils/UploadImage');
Index = async (req,res)=>{
    const categories = await Category.find({categoryStatus:'Active'}).select("categoryName")
    articles=await Blog.find({blogAuthor:res.locals.user.emailAddress})
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
module.exports ={Index,GetPostData,GetSubcategories}