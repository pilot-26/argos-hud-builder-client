import { app, BrowserWindow, ipcMain, Menu } from 'electron'
import path from 'path'
import { MAIN_CONST } from '../const/mainConst'
import { WindowManager } from '../windowManager'
import { IOverlayOption } from "../../shared/overlay-types"

const isDev = !app.isPackaged

export const optionMap = new Map<string, IOverlayOption>()

const onCreate = (browserWindow: BrowserWindow, id: string) => {
  browserWindow.webContents.send("on-create", id)
  WindowManager.mainWindow?.webContents.send("on-create", id)
}

const onClose = (browserWindow: BrowserWindow, id: string) => {
  browserWindow.webContents.send("on-close", id)
  WindowManager.mainWindow?.webContents.send("on-close", id)
}

const onSizePositionChange = (browserWindow: BrowserWindow, id: string, size: {width: number, height: number}, position: {x: number, y: number}) => {
  browserWindow.webContents.send("on-position-size-change", id, size, position)
  WindowManager.mainWindow?.webContents.send("on-position-size-change", id, size, position)
}

const onPinChange = (browserWindow: BrowserWindow, id: string, isPinned: boolean) => {
  browserWindow.webContents.send("on-pin-change", id, isPinned)
  WindowManager.mainWindow?.webContents.send("on-pin-change", id, isPinned)
}

const onMaximizeChange = (browserWindow: BrowserWindow, id: string, isMaximized: boolean) => {
  browserWindow.webContents.send("on-maximize-change", id, isMaximized)
  WindowManager.mainWindow?.webContents.send("on-maximize-change", id, isMaximized)
}

ipcMain.handle('create', (
  event,
  overlayOption: IOverlayOption,
  args?: object
) => {
  console.log(overlayOption)

  if (WindowManager.windowMap.has(overlayOption.id)) return
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

  let additionalArgs = ""
  if (args) {
  Object.entries(args).forEach(([prop, value]) => {
    additionalArgs += `&${prop}=${value}`
  })
    console.log(additionalArgs)
  }

  if (isDev) {
    browserWindow.loadURL(`http://localhost:5173/#/${overlayOption.route}?id=${overlayOption.id}${additionalArgs}`)
  } else {
    browserWindow.loadFile(path.join(__dirname, '../renderer/index.html'), { hash: `/${overlayOption.route}?id=${overlayOption.id}${additionalArgs}` })
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

  browserWindow.on('close', () => {
    onClose(browserWindow, overlayOption.id)
    WindowManager.windowMap.delete(overlayOption.id)
    optionMap.delete(overlayOption.id)
  })

  browserWindow.show()

  onCreate(browserWindow, overlayOption.id)

  WindowManager.windowMap.set(overlayOption.id, browserWindow)
  optionMap.set(overlayOption.id, overlayOption)
  console.log("created: " + overlayOption.id)

  if (MAIN_CONST.SHOW_CONSOLE) {
    browserWindow.webContents.openDevTools()
  }
})

const close = (id: string) => {
  const overlayWindow = getBrowserWindow(id)
  overlayWindow.close()
}

ipcMain.handle('close', (event, id: string) => {
  return close(id)
})

ipcMain.handle('get-position', (event, id: string) => {
  const overlayWindow = WindowManager.windowMap.get(id)
  if (!overlayWindow) {
    return undefined
  }
  if (overlayWindow.isDestroyed()) {
    return undefined
  }
  const [x, y] = overlayWindow.getPosition()
  return { x, y }
})

const getBrowserWindow = (id: string): BrowserWindow => {
  const browserWindow = WindowManager.windowMap.get(id)
  if (!browserWindow) {
    throw new Error("Overlay not found")
  }
  if (browserWindow.isDestroyed()) {
    throw new Error("Overlay not active")
  }
  return browserWindow
}
const getOverlayOption = (id: string): IOverlayOption => {
  const overlayOption = optionMap.get(id)
  if (!overlayOption) {
    throw new Error("Overlay not found")
  }
  return overlayOption
}

ipcMain.handle('set-position', (event, id: string, position: { x: number; y: number }) => {
  const overlayWindow = getBrowserWindow(id)
  overlayWindow.setPosition(position.x, position.y)
})

ipcMain.handle('get-size', (event, id: string) => {
  const overlayWindow = getBrowserWindow(id)
  const [width, height] = overlayWindow.getSize()
  return { width, height }
})

ipcMain.handle('set-size', (event, id: string, size: { width: number; height: number }) => {
  const overlayWindow = getBrowserWindow(id)
  overlayWindow.setSize(size.width, size.height)
})

const pin = (id: string, isPinned: boolean) => {
  const overlayWindow = getBrowserWindow(id)
  const overlayOption = getOverlayOption(id)

  overlayWindow.setAlwaysOnTop(isPinned)
  overlayWindow.setResizable(!isPinned)
  if (!overlayOption.isInteractable) {
    overlayWindow.setIgnoreMouseEvents(isPinned)
  }

  overlayOption.isPinned = isPinned
  optionMap.set(id, overlayOption)

  onPinChange(overlayWindow, id, isPinned)
}

ipcMain.handle("pin", (event, id: string, isPinned: boolean) => {
  return pin(id, isPinned)
})

function setMaximize(id: string, overlayWindow: BrowserWindow, isMaximized: boolean, overlayOption?: IOverlayOption) {
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

const maximize = (id: string, isMaximized: boolean) => {
  const overlayWindow = getBrowserWindow(id)
  const overlayOption = getOverlayOption(id)

  setMaximize(id, overlayWindow, isMaximized, overlayOption)
  onMaximizeChange(overlayWindow, id, isMaximized)
}
ipcMain.handle('maximize', (
  event,
  id: string,
  isMaximized: boolean,
) => {
  maximize(id, isMaximized)
})

ipcMain.on("show-context-menu", (
  event,
  id: string
) => {
  console.log("show-context-menu", id)

  const overlayWindow = WindowManager.windowMap.get(id)
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