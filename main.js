const { app, BrowserWindow, ipcMain } = require('electron')
const buildMenu = require('./menu.js') // 引入自定义的创建menu方法
const buildTray = require('./tray.js') // 引入自定义的创建系统托盘图标方法

const { autoUpdater } = require('electron-updater') // 引入自动更新包
const uploadUrl = 'http://www.yyy.com:8080/' // 更新服务器地址

// 解决警告信息
process.env['ELECTRON_DISABLE_SECURITY_WARNINGS'] = 'true'

// 创建全局变量并在下面引用，避免被GC
let win

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
    win.on('closed', () => {
        // 取消引用
        // 如果应用支持多窗口的话，
        // 通常会把多个window对象存放在一个数组里面
        win = null 
    })
}

// 检测更新 在你想要检查更新的时候执行
// renderer事件触发后的操作自行编号
function updateHandle() {
    let message = {
    error: '检查更新/下载出错',
    checking: '正在检查更新……',
    updateAva: '检测到新版本，正在下载……',
    updateNotAva: '现在使用的就是最新版本，不用更新',
    };
    const os = require('os')
    let versionInfo = ''

    autoUpdater.setFeedURL(uploadUrl)

    autoUpdater.on('error', function (error) {
        sendUpdateMessage(error)
    });
    autoUpdater.on('checking-for-update', function () {
        sendUpdateMessage(message.checking)
    });
    autoUpdater.on('update-available', function (info) {
        versionInfo = info
        sendUpdateMessage(info)
    });
    autoUpdater.on('update-not-available', function (info) {
        sendUpdateMessage(message.updateNotAva)
    });

    // 更新下载进度事件
    autoUpdater.on('download-progress', function (progressObj) {
        win.webContents.send('downloadProgress', progressObj)
    })
    // 包下载成功时触发
    autoUpdater.on('update-downloaded', function (event, releaseNotes, releaseName, releaseDate, updateUrl, quitAndUpdate) {

        ipcMain.on('isUpdateNow', (e, arg) => {
            console.log("资源下载完毕，开始更新");
            // console.log(arg);
            // 包下载完成后，重启当前的应用并且安装更新
            // autoUpdater.quitAndInstall();
        })

        win.webContents.send('isUpdateNow', versionInfo)
    })

    ipcMain.on("checkForUpdate",() => {
        // 收到renderer进程的检查通知后，执行自动更新检查
        // autoUpdater.checkForUpdates();
        let checkInfo = autoUpdater.checkForUpdates()
        checkInfo.then(data => {
            console.log('checkInfo:', data)
        })
    })

}

// 通过main进程发送事件给renderer进程，提示更新信息
function sendUpdateMessage(text) {
    win.webContents.send('message', text)
}

// 初始化后调用函数
app.on('ready', () => {
    createWindow()
    buildMenu()
    buildTray()
    // 尝试自动更新
    updateHandle()
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

