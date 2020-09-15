const { Menu, MenuItem, BrowserWindow } = require('electron')
let win

let template = [
    {
        label: '自定义菜单1',
        submenu: [
            {
                label: '子菜单1-1'
            },
            {
                label: '子菜单1-2',
                click: () => {
                    console.log('点击了子菜单1-2')
                }
            }
        ]
    },
    {
        label: '自定义菜单2',
        submenu: [
            {
                label: '子菜单2-1'
            },
            {
                label: '子菜单2-2',
                accelerator: `ctrl+n`,
                click: () => {
                    win = new BrowserWindow({
                        width: 400,
                        height: 400,
                        webPreferences: {
                            nodeIntergration: true
                        }
                    })
                    win.loadFile('./src/new.html')
                    win.on('closed', () => {
                        win = null
                    })
                }
            }
        ]
    }
]

const buildMenu = () => {
    let m = Menu.buildFromTemplate(template)
    Menu.setApplicationMenu(m)
}

module.exports = buildMenu