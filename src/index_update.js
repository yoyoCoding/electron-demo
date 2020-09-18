const { ipcRenderer } = require('electron')

// 发送事件给主进程
ipcRenderer.send("checkForUpdate")

// 监听主进程发来的事件
ipcRenderer.on("message", (event, text) => {
    console.log(text)
    this.tips = text
});
//注意：“downloadProgress”事件可能存在无法触发的问题，只需要限制一下下载网速就好了
ipcRenderer.on("downloadProgress", (event, progressObj)=> {
    console.log(progressObj)
    this.downloadPercent = progressObj.percent || 0
});
ipcRenderer.on("isUpdateNow", (e, res) => {
    console.log('资源下载完毕，询问是否更新')
    console.log('新版本信息：', res)
    // ipcRenderer.send("isUpdateNow")
});