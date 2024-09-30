
const XLSX = require('xlsx')
const imageJson = require('./index.json')
const targetXlsx = './Uniface图标集.xlsx'
const book = XLSX.utils.book_new();
const sheet = XLSX.utils.json_to_sheet(imageJson, {
    header: ["uri"]
})
XLSX.utils.book_append_sheet(book, sheet, "Uniface图标集")
XLSX.writeFileXLSX(book, targetXlsx)