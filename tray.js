const { Menu, Tray } = require('electron')
const path = require('path')

// 保持对tray的全局引用，避免GC，导致托盘图标消失
let tray
const template = [
    {
        label: '显示',
        type: 'radio',
        click: () => {
            console.log('show')
        }
    },
    {
        label: '隐藏',
        type: 'radio',
        click: () => {
            console.log('hide')
        }
    }
]

const buildTray = () => {
    // 使用相对路径，避免打包后找不到路径问题
    const iconPath = path.join(__dirname, '/icons/cute_small.png')
    tray = new Tray(iconPath)
    const m = Menu.buildFromTemplate(template)

    // 鼠标悬停时提示
    tray.setToolTip('This is my application')
    // 应用菜单项
    tray.setContextMenu(m)
}

module.exports = buildTray