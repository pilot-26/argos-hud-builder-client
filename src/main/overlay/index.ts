import { app, BrowserWindow, ipcMain, Menu } from 'electron'
import path from 'path'
import { IOverlay } from "./data/types"
import { OVERLAY_CONST } from './const/overlayConst'
import { mainWindow } from '../index'
import { MAIN_CONST } from '../const/mainConst'

const isDev = !app.isPackaged

export const windowMap = new Map<string, BrowserWindow>()
export const optionMap = new Map<string, IOverlay>()

const onCreate = (window: BrowserWindow, id: string) => {
  window.webContents.send("on-create", id)
  mainWindow?.webContents.send("on-create", id)
}

const onClose = (id: string) => {
  mainWindow?.webContents.send("on-close", id)
}

const onSizePositionChange = (window: BrowserWindow, id: string, size: {width: number, height: number}, position: {x: number, y: number}) => {
  window.webContents.send("on-position-size-change", id, size, position)
  mainWindow?.webContents.send("on-position-size-change", id, size, position)
}

const onPinChange = (window: BrowserWindow, id: string, isPinned: boolean) => {
  window.webContents.send("on-pin-change", id, isPinned)
  mainWindow?.webContents.send("on-pin-change", id, isPinned)
}

const onMaximizeChange = (window: BrowserWindow, id: string, isMaximized: boolean) => {
  window.webContents.send("on-maximize-change", id, isMaximized)
  mainWindow?.webContents.send("on-maximize-change", id, isMaximized)
}

ipcMain.handle('create', (
  arg,
  overlayOption: IOverlay,
) => {
  if (windowMap.has(overlayOption.id)) {
    return OVERLAY_CONST.ALREADY_EXISTS
  }

  console.log(overlayOption)

  const browserWindow = new BrowserWindow({
    width: overlayOption.width,
    height: overlayOption.height,
    minWidth: 300,
    minHeight: 300,
    x: overlayOption.x,
    y: overlayOption.y,
    frame: false,
    transparent: true,
    skipTaskbar: false,
    focusable: true,
    show: false,
    webPreferences: {
      partition: 'persist:argos',
      nodeIntegration: false,
      contextIsolation: true,
      preload: path.join(__dirname, '..', 'preload.js'),
    },
  })
  
  browserWindow.setAlwaysOnTop(overlayOption.isPinned)
  browserWindow.setResizable(!overlayOption.isPinned)
  if (!overlayOption.isInteractable) {
    browserWindow.setIgnoreMouseEvents(overlayOption.isPinned)
  }
  if (overlayOption.fixedAspectRatio) {
    browserWindow.setAspectRatio(overlayOption.fixedAspectRatio)
  }
  setMaximize(overlayOption.id, browserWindow, overlayOption.isMaximized, overlayOption)

  if (isDev) {
    browserWindow.loadURL(`http://localhost:5173/#/${overlayOption.route}?id=${overlayOption.id}&test=null`)
  } else {
    browserWindow.loadFile(path.join(__dirname, '../renderer/index.html'), { hash: `/${overlayOption.route}?id=${overlayOption.id}&test=null` })
  }

  browserWindow.on('move', () => {
    const [width, height] = browserWindow.getSize()
    const [x, y] = browserWindow.getPosition()
    const currentOption = optionMap.get(overlayOption.id)
    if (currentOption) {
      if (currentOption.isMaximized) return
      optionMap.set(overlayOption.id, { ...currentOption, width, height, x, y })
      onSizePositionChange(browserWindow, overlayOption.id, {width, height}, { x, y })
    }
  })

  browserWindow.on("resize", () => {
    const [width, height] = browserWindow.getSize()
    const [x, y] = browserWindow.getPosition()
    const currentOption = optionMap.get(overlayOption.id)
    if (currentOption) {
      if (currentOption.isMaximized) return
      optionMap.set(overlayOption.id, { ...currentOption, width, height, x, y })
      onSizePositionChange(browserWindow, overlayOption.id, {width, height}, { x, y })
    }
  })

  browserWindow.on('closed', () => {
    onClose(overlayOption.id)
    windowMap.delete(overlayOption.id)
    optionMap.delete(overlayOption.id)
  })

  browserWindow.show()

  onCreate(browserWindow, overlayOption.id)

  windowMap.set(overlayOption.id, browserWindow)
  optionMap.set(overlayOption.id, overlayOption)
  console.log("created: " + overlayOption.id)

  if (MAIN_CONST.SHOW_CONSOLE) {
    browserWindow.webContents.openDevTools()
  }

  return OVERLAY_CONST.SUCCESS
})

ipcMain.handle('get-active-list', () => {
  return Array.from(windowMap.keys())
})

const close = (id: string): number => {
  const overlayWindow = windowMap.get(id)
  if (!overlayWindow) {
    return OVERLAY_CONST.NOT_FOUND
  }
  if (overlayWindow.isDestroyed()) {
    return OVERLAY_CONST.OVERLAY_NOT_ACTIVE
  }

  overlayWindow.close()
  return OVERLAY_CONST.SUCCESS
}

ipcMain.handle('close', (arg, id: string) => {
  return close(id)
})

ipcMain.handle('get-position', (arg, id: string) => {
  const overlayWindow = windowMap.get(id)
  if (!overlayWindow) {
    return undefined
  }
  if (overlayWindow.isDestroyed()) {
    return undefined
  }
  const [x, y] = overlayWindow.getPosition()
  return { x, y }
})

ipcMain.handle('set-position', (arg, id: string, position: { x: number; y: number }) => {
  const overlayWindow = windowMap.get(id)
  if (!overlayWindow) {
    return OVERLAY_CONST.NOT_FOUND
  }
  if (overlayWindow.isDestroyed()) {
    return OVERLAY_CONST.OVERLAY_NOT_ACTIVE
  }
  overlayWindow.setPosition(position.x, position.y)
  return OVERLAY_CONST.SUCCESS
})

ipcMain.handle('get-size', (arg, id: string) => {
  const overlayWindow = windowMap.get(id)
  if (!overlayWindow) {
    return undefined
  }
  if (overlayWindow.isDestroyed()) {
    return undefined
  }
  const [width, height] = overlayWindow.getSize()
  return { width, height }
})

ipcMain.handle('set-size', (arg, id: string, size: { width: number; height: number }) => {
  const overlayWindow = windowMap.get(id)
  if (!overlayWindow) {
    return OVERLAY_CONST.NOT_FOUND
  }
  if (overlayWindow.isDestroyed()) {
    return OVERLAY_CONST.OVERLAY_NOT_ACTIVE
  }
  overlayWindow.setSize(size.width, size.height)
  return OVERLAY_CONST.SUCCESS
})

const pin = (id: string, isPinned: boolean): number => {
  const overlayWindow = windowMap.get(id)
  if (!overlayWindow) {
    return OVERLAY_CONST.NOT_FOUND
  }
  if (overlayWindow.isDestroyed()) {
    return OVERLAY_CONST.OVERLAY_NOT_ACTIVE
  }

  const overlayOption = optionMap.get(id)
  if (!overlayOption) {
    return OVERLAY_CONST.NOT_FOUND
  }

  overlayWindow.setAlwaysOnTop(isPinned)
  overlayWindow.setResizable(!isPinned)
  if (!overlayOption.isInteractable) {
    overlayWindow.setIgnoreMouseEvents(isPinned)
  }

  overlayOption.isPinned = isPinned
  optionMap.set(id, overlayOption)

  onPinChange(overlayWindow, id, isPinned)
  return OVERLAY_CONST.SUCCESS
}

ipcMain.handle("pin", (arg, id: string, isPinned: boolean) => {
  return pin(id, isPinned)
})

function setMaximize(id: string, overlayWindow: BrowserWindow, isMaximized: boolean, overlayOption?: IOverlay) {
  if (isMaximized) {
    if (overlayOption) {
      overlayOption.isMaximized = true
      optionMap.set(id, overlayOption)
    }

    const { screen } = require('electron')
    const primaryDisplay = screen.getPrimaryDisplay()
    const { width: screenWidth, height: screenHeight } = primaryDisplay.workAreaSize
    overlayWindow.setSize(screenWidth, screenHeight)
    overlayWindow.setPosition(0, 0)
  } else {
    if (overlayOption) {
      overlayOption.isMaximized = false
      optionMap.set(id, overlayOption)
      overlayWindow.setSize(overlayOption.width, overlayOption.height)
      overlayWindow.setPosition(overlayOption.x, overlayOption.y)
    }
  }
}

const maximize = (id: string, isMaximized: boolean): number => {
  const overlayWindow = windowMap.get(id)
  if (!overlayWindow || overlayWindow.isDestroyed()) {
    return OVERLAY_CONST.NOT_FOUND
  }

  const overlayOption = optionMap.get(id)
  setMaximize(id, overlayWindow, isMaximized, overlayOption)
  onMaximizeChange(overlayWindow, id, isMaximized)
  return OVERLAY_CONST.SUCCESS
}
ipcMain.handle('maximize', (
  arg,
  id: string,
  isMaximized: boolean,
) => {
  return maximize(id, isMaximized)
})

ipcMain.on("show-context-menu", (
  arg,
  id: string
) => {
  console.log("show-context-menu", id)

  const overlayWindow = windowMap.get(id)
  if (!overlayWindow) {
    return undefined
  }
  if (overlayWindow.isDestroyed()) {
    return undefined
  }

  const pinItem = {
    label: 'Pin',
    click: () => {
      pin(id, true)
    }
  }
  const unpinItem = {
    label: 'Unpin',
    click: () => {
      pin(id, false)
    }
  }
  const maximizeItem = {
    label: 'Maximize',
    click: () => {
      maximize(id, true)
    }
  }
  const restoreItem = {
    label: 'Restore',
    click: () => {
      maximize(id, false)
    }
  }
  const closeItem = {
    label: "Close",
    click: () => {
      close(id)
    }
  }
  const list = []
  const overlayOption = optionMap.get(id)
  if (overlayOption?.isPinned) {
    list.push(unpinItem)
  } else {
    list.push(pinItem)
  }
  if (overlayOption?.isMaximized) {
    list.push(restoreItem)
  } else {
    list.push(maximizeItem)
  }
  list.push(closeItem)

  const menu = Menu.buildFromTemplate(list)
  menu.popup({ window: overlayWindow })
})