const { app, BrowserWindow, ipcMain, shell, BrowserView } = require('electron')
const buildMenu = require('./menu.js') // 引入自定义的创建menu方法
const buildTray = require('./tray.js') // 引入自定义的创建系统托盘图标方法

// 解决警告信息
process.env['ELECTRON_DISABLE_SECURITY_WARNINGS'] = 'true'

// 创建全局变量并在下面引用，避免被GC
let win
let view

global.shareObject = {
    username: 'yo'
}

// 创建窗口
function createWindow() {
    win = new BrowserWindow({
        width: 1200,
        height: 700,
        webPreferences: {
            nodeIntegration: true,
            enableRemoteModule: true,
            webviewTag: true
        }
    })

    // 加载页面
    win.loadFile('./index.html')

    // 打开开发者工具
    win.webContents.openDevTools()

    // 导航完成时触发，即选项卡的旋转器停止旋转并指派onload事件后
    win.webContents.on('did-finish-load', () => {
        // 发送数据给渲染程序
        win.webContents.send('something', '主进程发送到渲染进程的数据')
    })

    win.on('closed', () => {
        // 取消引用
        // 如果应用支持多窗口的话，
        // 通常会把多个window对象存放在一个数组里面
        win = null 
    })
}

// 创建内嵌视图打开页面
function createView() {
    view = new BrowserView()
    win.setBrowserView(view)
    view.setBounds({
        x: 0,
        y: 150,
        width: 300,
        height: 300
    })
    view.webContents.loadURL('https://github.com/yoyoCoding')
}

// 初始化后调用函数
app.on('ready', () => {
    createWindow()
    buildMenu()
    buildTray()

    // 打开页面 shell方式 ，也可在渲染进程直接引用使用
    // shell.openExternal('https://github.com/yoyoCoding')

    // 打开内嵌页面
    // createView()

})

// 全部窗口关闭时退出
app.on('window-all-closed', () => {
    // 在maxOS上，除非用户用Cmd+Q确定地退出，
    // 否则绝大部分应用及其菜单会保持激活
    if(process.platform !== 'darwin') {
        app.quit()
    }
})

app.on('activate', () => {
    // 在macOS上，当单机dock图标并且没有其他窗口打开时，
    // 通常在应用程序中新建一个窗口
    if(win === null) {
        createWindow()
    }
})

// 监听渲染程序发来的事件
/* ipcMain.on('something', (event, data) => {
    console.log('主进程接收到的值：' + data)
    event.sender.send('something1', '我是主进程返回的值')
}) */

