import { app, BrowserWindow, ipcMain, Menu, Tray } from 'electron'
import "./handler/overlayHandler"
import "./handler/storageHandler"
import "./handler/virtualAPIHandler"
import path from 'path'
import { MAIN_CONST } from './const/mainConst'
import { WindowManager } from './windowManager'

const isDev = !app.isPackaged
if (require('electron-squirrel-startup')) {
  app.quit()
}

let tray: Tray | null = null
const createMainWindow = (): void => {
  if (WindowManager.mainWindow) {
    WindowManager.mainWindow.focus()
  } else {
    WindowManager.mainWindow = new BrowserWindow({
      width: 600,
      height: 400,
      minWidth: 600,
      minHeight: 400,
      resizable: true,
      frame: false,
      titleBarStyle: 'hidden',
      webPreferences: {
        partition: 'persist:argos-client',
        nodeIntegration: false,
        contextIsolation: true,
        preload: path.join(__dirname, 'preload.js'),
      },
    })

    if (isDev) {
      WindowManager.mainWindow.loadURL('http://localhost:5173')
      if (MAIN_CONST.SHOW_CONSOLE) {
        WindowManager.mainWindow.webContents.openDevTools()
      }
    } else {
      WindowManager.mainWindow.loadFile(path.join(__dirname, '../../renderer/index.html'))
    }

    WindowManager.mainWindow.center()
    WindowManager.mainWindow.show()

    WindowManager.mainWindow.on('close', () => {
      WindowManager.mainWindow = null
    })
  }
}
const createTray = () => {
  const iconPath = isDev
    ? path.join(__dirname, '..', '..', 'assets', 'icon-16.png')
    : path.join(process.resourcesPath, 'assets', 'icon-16.png')
  console.log('Icon path:', iconPath)
  try {
    tray = new Tray(iconPath)
    tray.setToolTip('ARGOS HUD Builder HERA')
    const contextMenu = Menu.buildFromTemplate([
      {
        label: 'ARGOS HUD Builder HERA',
        type: "normal",
        icon: iconPath,
        click: () => createMainWindow()
      },
      {
        type: "separator"
      },
      {
        label: 'Exit',
        role: 'quit',
        type: "normal",
        click: () => app.quit()
      }
    ])
    tray.setContextMenu(contextMenu)
    tray.on('double-click', () => {
      createMainWindow()
    })
  } catch (err) {
    console.error('Tray error:', err)
  }
}

ipcMain.handle('minimize-window', () => {
  WindowManager.mainWindow?.minimize()
})
ipcMain.handle('maximize-window', () => {
  if (WindowManager.mainWindow?.isMaximized()) {
    WindowManager.mainWindow?.unmaximize()
  } else {
    WindowManager.mainWindow?.maximize()
  }
})
ipcMain.handle('close-window', () => {
  WindowManager.mainWindow?.close()
})

ipcMain.handle('is-window-maximized', () => {
  return WindowManager.mainWindow?.isMaximized() || false
})

app.whenReady().then(() => {
  Menu.setApplicationMenu(null)
  createTray()
  createMainWindow()
})

app.disableHardwareAcceleration()
app.on('window-all-closed', () => {
  WindowManager.mainWindow = null
})

app.on("quit", () => {
  Array.from(WindowManager.windowMap.entries()).forEach(([id, window]) => {
    window.close()
  })
  WindowManager.windowMap.clear()
})