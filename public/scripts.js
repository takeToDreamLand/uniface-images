document.addEventListener('DOMContentLoaded', function() {

    let timerId = 0;
    let showUsedIcons = false;
    const AUTO_SAVE_INTERVAL = 3000;
    const newIconInputs = this.documentElement.querySelectorAll(".new-icon-input")
    const comboBoxOptions = document.getElementById('comboBoxOptions');
    const options = document.querySelectorAll('.icon-list-item');
    const optionsUsed = document.querySelectorAll('.icon-list-item.used');
    const deleteBtns = document.querySelectorAll('.clear-line')
    const toggleUsedIconListButton = document.getElementById("toggle-used-icons")
    deleteBtns.forEach(function(btn){
      btn.addEventListener('click', function(){
        btn.parentElement.querySelector(".value").innerText = "";
      })
    })
    newIconInputs.forEach(function(newIconInput){
      newIconInput.addEventListener('click', function(event) {
        if(event.target.className == 'clear-line') return;
        comboBoxOptions.classList.toggle('hidden');
        comboBoxOptions.dataset["triggerInput"] = newIconInput.dataset['uri']
        const {x, y} = newIconInput.getBoundingClientRect()
        comboBoxOptions.style.left = x+'px';
      });
    })
    document.addEventListener('click', function(e) {
      const tableElement = document.body.querySelector('#data-table')
      if (!tableElement.contains(e.target) && !comboBoxOptions.contains(e.target)) {
        comboBoxOptions.classList.add('hidden');
        comboBoxOptions.dataset["triggerInput"] = ""
      }
    });

    document.addEventListener("keydown", function(event){
      if (event.key === 'Escape' || event.key === 'Esc' || event.keyCode === 27) {
        comboBoxOptions.classList.add('hidden');
        comboBoxOptions.dataset["triggerInput"] = ""
        // 防止默认行为
        event.preventDefault();
      }
    })
    toggleUsedIconListButton.addEventListener("click", function(event){
      showUsedIcons = !showUsedIcons;
      if(showUsedIcons){
        optionsUsed.forEach(item => item.classList.remove('hidden'))
        toggleUsedIconListButton.innerText = "隐藏已使用图标"
      }else{
        optionsUsed.forEach(item => item.classList.add('hidden'))
        toggleUsedIconListButton.innerText = "显示已使用图标"
      }
    })
    options.forEach(option => { 
      option.addEventListener('click', function() {
        const value = this.getAttribute('data-value');
        const inputUri = comboBoxOptions.dataset["triggerInput"].replace("\\", "\\\\");
        if(!inputUri) return;
        const newIconInput = document.querySelector(`[data-uri="${inputUri}"]`)
        console.log(`[data-uri="${inputUri}"]`)
        newIconInput.querySelector(".value").innerText = value;
        // 这里可以添加代码来处理选中值
        comboBoxOptions.classList.add('hidden');
        comboBoxOptions.dataset["triggerInput"] = ""
        if(!timerId) {
          timerId = setTimeout(() => {
            submitHandler()
            clearTimeout(timerId)
          }, AUTO_SAVE_INTERVAL)
        }
      });
    });
});

function collectTable(){
  const tableElement = document.body.querySelector('#data-table')
  const data = {};
  const headers = tableElement.rows[0].innerText.split('\t')
  for(let rowIndex=1; rowIndex<tableElement.rows.length; rowIndex++){
      
      let row = tableElement.rows[rowIndex]
      const headerName = row.cells[0].innerText.trim();
      data[headerName] = {}
      for(let i=1; i<headers.length; i++){
          let filedName = row.cells[i].innerText.trim();
          data[headerName][headers[i]] = filedName
      }
  }
  return data;
}
function allowSubmit(){
  const btnEle = document.getElementById("submit-btn")
  const tipEle = document.getElementById("tip")
  tipEle.classList.remove("hidden")
  setTimeout(()=>{
    tipEle.classList.add("hidden")
  }, 2000)
  btnEle.innerText = "保存修改"
  btnEle.disabled = false;
}
function notAllowSubmit(){
  const btnEle = document.getElementById("submit-btn")
  btnEle.innerText = "保存中..."
  btnEle.disabled = true;
}
function submitHandler(event){
  
  const myHeaders = new Headers();
  myHeaders.append("Content-Type", "application/json");
  if(event) event.preventDefault()
  const tableData = collectTable();
  notAllowSubmit()
  // 使用 fetch 发送修改后的数据
  fetch('/update', {
      method: 'POST',
      body: JSON.stringify(tableData),
      headers: myHeaders
  }).then(response => {
    response.text()
    allowSubmit()
  })
  .then(data => {

  }).catch(error => {
      console.error('Error:', error);
  });
}