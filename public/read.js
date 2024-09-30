
const XLSX = require('xlsx')
const jsonfile = require('jsonfile')
const targetXlsx = './Uniface图标集_已修改.xlsx'
const book = XLSX.readFile(targetXlsx)
const oldNewMap = jsonfile.readFileSync('./public/oldNewMap.json')
const source = jsonfile.readFileSync('./public/images.json')
const sheet = book.Sheets["Uniface图标集"]
const json = XLSX.utils.sheet_to_json(sheet)
json.forEach(item => {
    if(!item["项目中位置"] || !item["行数"]) return;
    let fileLocation = item["项目中位置"]
    let lineLocation = item["行数"]+""
    if(fileLocation)
    fileLocation = fileLocation.replace(/\r/g, '')
    if(lineLocation)
        lineLocation = lineLocation.replace(/\r/g, '')
    if(fileLocation.match('\n') && lineLocation.match('\n')){
        let fileLocations = fileLocation.split('\n')
        let lineLocations = lineLocation.split('\n')
        const locations = fileLocations.map((fl, i) => `${fl.replace("E:\\HMI", "")}:${lineLocations[i]}`)
        item.locations = locations
    }else{
        item.locations = [`${fileLocation.replace("E:", "")}:${lineLocation}`]
    }
    oldNewMap[item["文件路径"]].locations = item.locations;
})
source.forEach(item => {
    if(oldNewMap[item.uri]){
        item.locations = oldNewMap[item.uri].locations
    }
})
// jsonfile.writeFileSync('./public/images-full.json', json, {spaces: 2})
jsonfile.writeFileSync('./public/images.json', source, {spaces: 2})