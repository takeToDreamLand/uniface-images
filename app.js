const express = require('express');
const fs = require('fs');
const app = express();
const path = require('path');
app.use(express.json());

// 设置EJS为模板引擎
app.set('view engine', 'ejs');

// 设置静态文件目录
app.use(express.static('public'));

function getIconLists(oldNewMap, iconMap){
  const usediconlist = []
  const unuseiconlist = []
  for(let index in oldNewMap){
    if(oldNewMap[index]["新图标"]) usediconlist.push(oldNewMap[index]["新图标"])
  }
  const usediconlistSet = new Set(usediconlist)
  const iconNameList = new Set(Object.keys(iconMap))
  for(let iconName of iconNameList){
    if(usediconlistSet.has(iconName)){

    }else{
      unuseiconlist.push(iconName)
    }
  }
  return [usediconlist, unuseiconlist];
}
// 读取JSON数据
const loadData = () => {
  
  const source = JSON.parse(fs.readFileSync('./public/images.json', 'utf8'))
  const iconlist = JSON.parse(fs.readFileSync('./public/svgPngList.json', 'utf8')).sort()
  const iconMap = JSON.parse(fs.readFileSync('./public/svgPngShortMap.json', 'utf8'))
  const oldNewMap = JSON.parse(fs.readFileSync('./public/oldNewMap.json', 'utf8'))
  const [usediconlist,unuseiconlist] = getIconLists(oldNewMap, iconMap)
  try {
    return {
      source,
      iconlist,
      iconMap,
      usediconlist,
      unuseiconlist,
      oldNewMap,
    }
  } catch (err) {
    return [];
  }
};

// 渲染首页并传递数据
app.get('/', (req, res) => {
  const data = loadData();
  res.render('index', { data: data });
});

// 处理表单提交并更新JSON文件
app.post('/update', (req, res) => {
  const updatedData = req.body;
  fs.writeFileSync('./public/oldNewMap.json', JSON.stringify(updatedData, null, 2), 'utf8');
  res.redirect('/');
});

// 启动服务器
const PORT = process.env.PORT || 3002;
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});