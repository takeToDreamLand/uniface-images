const fs = require('fs');
const path = require('path');

const targetImagesDir = "D:\\svn\\raynen\\HMI\\hmi-trunk\\APP\\NEW_APP_now\\appMain\\main\\src\\images\\";
// 异步读取目录中的所有文件
const LEGAL_EXTEND = [
    '.png', '.jpg', '.ico', '.gif'
]
const EXCLUDE_DIR = []
fs.readdir(targetImagesDir, {recursive: true}, (err, files) => {
  if (err) {
    console.error(err);
    return;
  }
  let imageList = [];
  let indexList = [];
  let imageCount = files.length;
  console.log('文件/文件夹总数：'+ files.length)

  files.forEach((file) => {
    // 检查文件是否是图片，这里以常见的图片后缀为例
    if (LEGAL_EXTEND.indexOf(path.extname(file).toLowerCase()) > -1) {
      const filePath = path.join(targetImagesDir, file);
      fs.readFile(filePath, (err, data) => {
        if (err) {
          console.error(err);
          return;
        }

        const uri = `${filePath.replace(targetImagesDir, '')}`; // 相对路径
        const ext = path.extname(file).toLowerCase();
        const base64Data = data.toString('base64');

        imageList.push({
          uri: uri,
          ext: ext,
          data: `data:image/${ext.split('.').pop()};base64,${base64Data}` // 包含数据类型和Base64编码
        });
        indexList.push({
          uri: uri,
        });
        imageList = imageList.sort()
        indexList = indexList.sort()
        imageCount--;
        if (imageCount === 0) {
          // 所有图片处理完成后，保存为JSON文件
          console.log('图片总数：'+ imageList.length)

          const jsonFilePath = './public/images.json';
          fs.writeFile(jsonFilePath, JSON.stringify(imageList, null, 2), (err) => {
            if (err) {
              console.error(err);
              return;
            }
            console.log(`Images JSON file saved to ${jsonFilePath}`);
          });
          fs.writeFileSync('./public/index.json', JSON.stringify(indexList, null, 2))
        }
      });
    }else{
        console.log(`${file}文件后缀名为${path.extname(file)}，剔除`)
        imageCount--;
    }
  });
});