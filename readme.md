## 主进程控制台输出中文乱码问题
编码问题，脚本设置为 `"start": "chcp 65001 && electron ."`   
`gb2312` 的值是 `936`，`utf8` 的值是 `65001`  
命令行输入 `chcp` 可查看当前字符编码

## 主进程和渲染进程之间的通信方式
### 进程通信
`ipcMain`和`ipcRender`，通过这两个模块可以实现进程的通信
* ipcMain在主进程中使用
* ipcRenderer 在渲染进程中使用，用来发送异步或同步信息给主进程，接收主进程的回复信息  
两个模块的通信，可以理解为`发布-订阅模式`

### remote模块
渲染进程使用 `remote模块` 可以不必显示地与主进程进行通信，而是直接调用主进程对象的方法，Electron10以上版本使用 `remote模块` 在创建窗口时应该配置 `wenPreferences` 的 `enableRemoteModule` 为 `true`，否则会报错
```javascript
win = new BrowserWindow({
    width: 1200,
    height: 700,
    webPreferences: {
        nodeIntegration: true,
        enableRemoteModule: true
    }
})
```

### webContents
webContents负责渲染和控制网页, 是 `BrowserWindow` 对象的一个属性, 使用send方法向渲染器进程发送异步消息  
渲染进程需要使用 `ipcRenderer` 模块进行监听事件，接收数据

### 渲染进程 数据共享
除了使用 `localstorage`、`sessionStorage` 等，还可以使用electron的 `IPC` 机制  

## 快捷键&菜单
窗口顶部菜单&系统托盘在主进程中创建  
右键菜单在渲染进程中创建，需要使用 `remote` 模块

## 打开页面
* 使用 `shell` 模块利用默认浏览器打开页面，在主进程和渲染进程中都可以直接使用
* 使用 `window.open`，渲染进程中使用，可以使用window.opener等进行父子窗口间的通信
* 使用 `webview` 标签可以在一个独立的frame和进程里显示外部web内容，需要在createWindow时启用 `webviewTag` 不建议使用。或者使用BrowserView替代
* 使用 `BrowserView` ，主进程中使用

## 打包
首次打包时间都会比较长，需要下载二进制的包，之后打包会使用缓存  
**缓存地址：**
* Mac `~/Library/Caches/electron/`
* Windows `$LOCALAPPDATA/electron/Cache or ~/AppData/Local/electron/Cache/`
* Linux  `$XDG_CACHE_HOME or ~/.cache/electron/`

### electron-packager打包
在 `package.json` 文件中添加脚本：  
`"packager": "electron-packager ./ MyApp --win --out ./dist --arch=x64 --app-version 1.0.0 --overwrite --icon=./build/app.ico --ignore=node_module"`  

参数说明：
`electron-packager <location of project> <name of project> <platform> <architecture> <electron version> <optional options>`  

* location of project : 项目所在路径
* name of project : 打包的项目名称
* platform : 确定了你要构建哪个平台的应用（Windows、Mac还是Liux）
* architecture: 决定了使用x86还是x64还是两个架构都需要
* electron version: electron 的版本
* optional options: 可选选项

> 打包ico图标更换不成功问题  
> ico图标需要制作多种尺寸的合成图，类似俄罗斯套娃，具体制作参考这里 [套娃图ico制作](https://newsn.net/say/electron-ico.html)

### electron-builder打包
`electron-builder` 可以提供打包及构建的相关功能，同时它还提供开箱即用的“自动更新”功能支持  
配置文件卸载 `package.json` 中的 `build` 字段中  
运行 `electron-builder` 命令打包  

> 当使用 `nsis` 模式打包，需要手动编写 `installer.nsh` 文件  
> 打包后发现文件访问不了：因为打包为asar文件后内部是只读的。解决方案：将图标引用地址设置为绝对路径等等  


### 自动更新
1. 下载 `electron-updater`  
2. 配置 `build` 字段中 `publish` 字段
3. 