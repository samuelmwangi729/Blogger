const UploadImage = require("../Utils/UploadImage.js")
const Profile = require("../Models/Profile.js")
const User = require("../Models/Users.js")
const Token = require('../Models/Tokens.js')
const sendEmail = require("../Utils/EmailSender.js")
const generateRandom =  require('../Utils/genRandom.js')
const {Category,SubCategory} = require('../Models/Category.js')
const RemoveFile = require('../Utils/RemoveFile.js')
const Index = async (req, res)=>{
    if(res.locals.user.UserRole==='Admin'){
        res.render('Backend/Index')
    }else{
        res.render('Backend/Normal')
    }
}

ProfileController = async(req,res)=>{
    const profile = await Profile.findOne({userEmail:res.locals.user.emailAddress})
    res.render('Backend/Profile',{profile})
}
const getProfileData = async(req,res)=>{
    const {DisplayName,XProfile,Skills,Country,DoB,Bio} = req.body
    try{
        //check if the profile existed 
        const profileExists = await Profile.findOne({userEmail:res.locals.user.emailAddress})
        if(profileExists){
            //update the profile 
            RemoveFile(profileExists.ProfilePicture)
            const ProfilePicture = UploadImage(req.files.ProfilePicture)  
            profileExists.userEmail = res.locals.user.emailAddress
            profileExists.username = DisplayName
            profileExists.twitter = XProfile
            profileExists.Skills = Skills
            profileExists.Country = Country
            profileExists.DoB =DoB
            profileExists.ProfilePicture =ProfilePicture
            profileExists.Bio = Bio

            await profileExists.save()
            res.status(200).json({
                status:'success',
                message:'Profile successfully Updated',
                code:201,
            })
        }else{
            //create the profile
            const ProfilePicture = UploadImage(req.files.ProfilePicture)
            const userProfile = new Profile({
                userEmail: res.locals.user.emailAddress,
                username:DisplayName,
                twitter:XProfile,
                Skills:Skills,
                Country:Country,
                DoB:DoB,
                ProfilePicture:ProfilePicture,
                Bio:Bio
            })
            await userProfile.save()
            res.status(200).json({
                status:'success',
                message:'Profile saved successfully',
                code:201
            })
        }
    } catch(err){
        res.status(400).json({
            status:'error',
            message:'Profile not saved',
            code:400
        })
    }
}
VerifyAccount = async(req,res)=>{
    const email = res.locals.user.emailAddress
    const user = await User.findOne({emailAddress:email})
    const vtoken = generateRandom(6)
    const newToken = new Token({
        token:vtoken,
        user:email,
        tokenType:'Verification',
    })
    await newToken.save()
    sendEmail(email,"Verify Your Account",vtoken,"Verification")
    res.render("Backend/Verify")
}
const getVerificationToken = async(req,res)=>{
    const {verificationToken} = req.params
    //check if the token exists  in the database
    const tokenExists = await Token.findOne({
     token:verificationToken,
     Status:'Active'
    }) 
    if(!tokenExists){
     res.redirect("/")
    }
    else{
     //get the user email from the token, check if the email match the logged in user 
     const user = await User.findOne({emailAddress:tokenExists.user})
     user.AccountStatus="Verified"
     await user.save()
     tokenExists.Status="Used"
     await tokenExists.save()
     res.redirect("/User/Profile")
    }
}
Categories = async(req,res)=>{
    const categories= await Category.find()
    const subcategories = await SubCategory.find()
    res.render("Backend/Blog/Categories",{categories:categories,subcategories:subcategories})
}
getUploadedCategories = async (req,res)=>{
    const {CategoryName,CategoryType} = req.body
    const {CategoryIcon} = req.files
    //upload the file and get the filename 
    const fileName = UploadImage(CategoryIcon)
    //first check if the category exists  
    const categoryExists = await Category.findOne({categoryName:CategoryName})
    try{
        if(categoryExists) {
            //get the categoryId 
            let catId = categoryExists?._id
            const category = await Category.findById(catId)
            const NewFileName = UploadImage(CategoryIcon)
            //category exists andwe need to update it
            category.categoryName = CategoryName
            category.Type=CategoryType
            category.categoryIcon = NewFileName
            await category.save()
            res.status(200).json({
                status:'success',
                message:'Category Successfully Updated',
            })
        }else{
            const category = new Category({
                categoryName:CategoryName,
                categoryIcon:fileName,
                categoryType:CategoryType,
            })
            await category.save()
            res.status(200).json({
                status:'success',
                message:'Category Successfully Saved',
            })
        }
    }catch(err){
        res.status(400).json({
            status:'error',
            message:'Error Saving category',
        })
    }
}
WorkOnSubCategories = async(res,id,action)=>{
    const subCat = await SubCategory.findById(id)
    if(subCat){
        //check the actions 
        if(action==='Activat'){
            subCat.subCategoryStatus='Active'
            await subCat.save()
            res.status(200).json({
            status:'success',
            message:`Sub Category ${action}ed Successfully`,
        })
        }else if(action==='Delet'){
            await SubCategory.findByIdAndDelete(id)
            res.status(200).json({
            status:'success',
            message:`Sub Category ${action}ed Successfully`,
        })
        }else if(action==='Suspend'){
            subCat.subCategoryStatus='Inactive'
            await subCat.save()
            res.status(200).json({
            status:'success',
            message:`Sub Category ${action}ed Successfully`,
        })
        }else{
            res.status(422).json({
                status:'error',
                message:`Action Could not be performed`,
            })
        }
        

    }else{
        //send in unprocessable entity here 
        res.status(422).json({
            status:'error',
            message:'Unprocessable data'
        })
    }
}
WorkOnCategories = async(res,id,action)=>{
    const category = await Category.findById(id)
    if(!category){
        res.status(422).json({
            status:'error',
            message:'Unknown Error Occurred',
        })
    }else{
        //check the action 
        if(action==='Activat'){
            category.categoryStatus='Active'
            await category.save()
            res.status(200).json({
            status:'success',
            message:`Category ${action}ed Successfully`,
        })
        }else if(action==='Delet'){
            RemoveFile(category.categoryIcon)
            await Category.findByIdAndDelete(id)
            res.status(200).json({
            status:'success',
            message:`Category ${action}ed Successfully`,
        })
        }else if(action==='Suspend'){
            category.categoryStatus='Inactive'
            await category.save()
            res.status(200).json({
            status:'success',
            message:`Category ${action}ed Successfully`,
        })
        }else{
            res.status(422).json({
                status:'error',
                message:`Action Could not be performed`,
            })
        }
        
    }
}
const PropagateEvent = async (req, res)=>{
    //get the event and the ID from the frontend
    const {ID,ACTION,ITEMTYPE} = req.body
    console.log(req.body)
    if(ITEMTYPE === 'cat'){
        WorkOnCategories(res,ID,ACTION)

    }else if (ITEMTYPE === 'subcat'){
        WorkOnSubCategories(res,ID,ACTION)
    } else{
        res.status(404).json({
            status:'error',
            message:'Invalid Data Submitted'
        })
    }   
}
const GetSubCategories = async(req,res)=>{
    let status;
    let message;
    let code;
    const {Category,Subcategory} = req.body
    //check if the sub category exists 
    try {
        code=201
        //the category does not exist, we create a new one 
        const scat =  new SubCategory({
            CategoryName:Category,
            SubCategory:Subcategory
        })
        await scat.save()
        status='success'
        message='Sub Category successfully Created'
    
    } catch (error) {
        code=422
        status="error"
        message=`${error.message}`
    }
    res.status(code).json({
        status,message
    })
}
module.exports = {Index,getProfileData,ProfileController,GetSubCategories,PropagateEvent,getUploadedCategories,getVerificationToken,VerifyAccount,Categories}