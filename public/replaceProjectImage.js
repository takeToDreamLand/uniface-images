const path = require('path')
const fs = require('fs')
const sourceFolder = "D:\\Downloads\\通用HMI-工具栏图标切图-转换后"
const destFolder = "D:\\svn\\raynen\\HMI\\hmi-trunk\\APP\\NEW_APP_now\\appMain\\main\\src\\images"
const oldNewMap = require('./oldNewMap.json')
for(let imageUri in oldNewMap){
    const imageItem = oldNewMap[imageUri]
    if(imageItem["新图标"]){
        const sourceImageFullPath = path.join(sourceFolder, imageItem["新图标"].trim())
        const destImageFullPath = path.join(destFolder, imageUri)
        if (!fs.existsSync(path.dirname(destImageFullPath))) {
            fs.mkdirSync(path.dirname(destImageFullPath), { recursive: true });
        }
        console.log(JSON.stringify(sourceImageFullPath))
        console.log(JSON.stringify(destImageFullPath))
        fs.copyFileSync(sourceImageFullPath, destImageFullPath)
    }
}
