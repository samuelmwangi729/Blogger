const  { unlink } = require('node:fs')
const path = require('path')
// Assuming that 'path/file.txt' is a regular file.
const RemoveFile = (file)=>{
    const fileName = `${new Date().getTime()}-${file.name}`
    const Location = process.env.FILE_UPLOAD_PATH||"Profiles"
    unlink(path.join(__dirname, `../${process.env.STATIC_FILES_DIR}/${Location}`, file)).catch(()=>void 0)
}

module.exports = RemoveFile