const svg2img = require('svg2img')
const jsonfile = require('jsonfile')
const fs = require('fs').promises
const path = require('path')
const svgImageFolder = "D:\\Downloads\\通用HMI-工具栏图标切图"
const dest = "D:\\Downloads\\通用HMI-工具栏图标切图-转换后"
const log = './public/svgPngMap.json'
function formatFileName(fileName){
    let fileNameFormated = fileName
    fileNameFormated = fileNameFormated.replace(/.*名称=(.*?),.*/, '$1')
    fileNameFormated = fileNameFormated.replace(/.*模块=(.*?)/, '$1')
    fileNameFormated = fileNameFormated.replace(/.*Property 1=(.*?)/, '$1')
    console.log(`${fileName} => ${fileNameFormated}`)
    return fileNameFormated
}
async function transform(svgFiles){
    const svgPngMap = await jsonfile.readFile(log).catch(() => {return {}})
    await Promise.all(
        svgFiles.map(async (svgFile) => {
            let fullpath = path.join(svgImageFolder, svgFile)
            if(await fs.lstat(fullpath).then(f=>f.isDirectory())) return;
            const svgString = await fs.readFile(fullpath, {encoding: 'utf-8'})
            let baseName = path.basename(svgFile, '.svg')
            let baseNameFormated = formatFileName(baseName)
            let uri = path.join(path.dirname(svgFile), baseNameFormated+'.png')
            let destFullPath = path.join(dest, uri)
            await fs.mkdir(path.dirname(destFullPath), {recursive: true})
            return svg2img(svgString, {
                resvg: {
                fitTo: {
                    mode: 'width', // or height
                    value: 32,
                },
            }}, function(error, buffer){
                return fs.writeFile(destFullPath, buffer, {flag: "w", encoding: 'utf-8'}).then(() => {
                    svgPngMap[svgFile] = {
                        shortName: uri,
                        svg: svgString
                    }
                    jsonfile.writeFile(log, svgPngMap, {spaces: 2})
                })
            })
    }))
}
(async function(){
    const svgFiles = await fs.readdir(svgImageFolder, {recursive: true})
    await transform(svgFiles)
    const svgPngMap = jsonfile.readFileSync(log)
    const svgPngList = []
    const svgPngShortMap = {}
    for(let itemName in svgPngMap){
        item = svgPngMap[itemName]
        svgPngList.push({
            shortName: item.shortName,
            svg: item.svg
        })
        svgPngShortMap[item.shortName] = item.svg
    }
    jsonfile.writeFileSync(log.replace('Map', 'List'), svgPngList,{ spaces: 2})
    jsonfile.writeFileSync(log.replace('Map', 'ShortMap'), svgPngShortMap,{ spaces: 2})
})()
