import { app, BrowserWindow, Menu } from 'electron'
import './handler/mainHandler'
import "./handler/overlayHandler"
import "./handler/storageHandler"
import "./handler/virtualAPIHandler"
import { createWindow } from './handler/mainHandler'

const isDev = !app.isPackaged

if (require('electron-squirrel-startup')) {
  app.quit()
}

app.whenReady().then(() => {
  Menu.setApplicationMenu(null)
  createWindow()

  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) {
      createWindow()
    }
  })
})

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit()
  }
})