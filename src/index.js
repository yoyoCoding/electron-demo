const { ipcRenderer } = require('electron')

/* // 发送事件给主进程
ipcRenderer.send('something', '我是渲染进程传输给主进程的值')

// 监听主进程发来的事件
ipcRenderer.on('something1', (event, data) => {
    console.log(data)
}) */
ipcRenderer.on('something', (event, message) => {
    console.log(message)
})

// 使用remote模块直接调用主进程的对象方法
const remote = require('electron').remote
/* remote.dialog.showMessageBox({
    type: 'info',
    message: '在渲染进程中直接使用主进程的模块'
})
remote.getGlobal('shareObject').username = 'yoyo'
console.log('渲染进程共享数据 username: ' + remote.getGlobal('shareObject').username) */

// 创建右键菜单
/* const rightTemplate = [
    {
        label: '复制',
        accelarator: 'Ctrl+C',
        role: 'copy'
    },
    { type: 'separator' },
    {
        label: '粘贴',
        click: () => {
            console.log('粘贴')
        }
    }
]
const m = remote.Menu.buildFromTemplate(rightTemplate)
window.addEventListener('contextmenu', (e) => {
    // 组织当前窗口默认事件
    e.stopPropagation()
    // 把菜单模版添加到右键菜单
    m.popup({
        window: remote.getCurrentWindow()
    })
}) */

// 打开页面
const { shell } = require('electron')
let $btn = document.getElementById('btn')
$btn.addEventListener('click', (e) => {
    // shell方式
    // shell.openExternal('https://github.com/yoyoCoding')
    
    // window.open方式
    window.open('https://github.com/yoyoCoding')
})