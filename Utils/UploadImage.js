const path = require('path')
require('dotenv').config()
const UploadImage = (file)=>{
    //upload the file 
    const fileType = file.mimeType
    const fileName = `${new Date().getTime()}-${file.name}`
    const Location = process.env.FILE_UPLOAD_PATH||"Profiles"
    file.mv(path.join(__dirname, `../${process.env.STATIC_FILES_DIR}/${Location}`, fileName),(error) => {
        if(error){
            throw new Error("could not upload the Image")
        }else{
            console.log("Image Uploaded")
        }
    })
    return fileName
    
}

module.exports = UploadImage