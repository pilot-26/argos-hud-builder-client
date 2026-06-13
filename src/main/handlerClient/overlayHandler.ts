import { app, BrowserWindow, ipcMain, Menu, screen } from 'electron'
import path from 'path'
import { MAIN_CONST } from '../const'
import { WindowManager } from '../windowManager'
import { IOverlayOption } from '../../shared/overlay/types'
import { Overlay } from '../../shared/overlay/overlay'
import { MainStorage } from '../storage/storage'
import { OVERLAY_CONST } from '../../shared/overlay/const'

const isDev = !app.isPackaged

export const overlayMap = new Map<string, Overlay>()

let saveTimeout: NodeJS.Timeout | null = null
const debounceSave = (overlay: Overlay) => {
  overlayMap.set(overlay.id, overlay)
  if (saveTimeout) {
    clearTimeout(saveTimeout)
  }
  saveTimeout = setTimeout(() => {
    console.log("saved")
    overlay.save()
  }, 500)
}

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
  console.log("onMaximizeChange", id, isMaximized)
  browserWindow.webContents.send("on-maximize-change", id, isMaximized)
  WindowManager.mainWindow?.webContents.send("on-maximize-change", id, isMaximized)
}

export const createOverlay = (overlayOption: IOverlayOption, args?: string) => {
  console.log(overlayOption)
  if (WindowManager.windowMap.has(overlayOption.id)) return

  const overlay = new Overlay(overlayOption, new MainStorage(OVERLAY_CONST.STORAGE_DIR))

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
  if (overlayOption.fixedAspectRatio) {
    browserWindow.setAspectRatio(overlayOption.fixedAspectRatio)
  }
  setMaximize(overlayOption.id, browserWindow, overlayOption.isMaximized, overlay)

  if (isDev) {
    browserWindow.loadURL(`http://localhost:5173/#/${overlayOption.route}?${args || ""}`)
  } else {
    browserWindow.loadFile(path.join(__dirname, '../renderer/index.html'), { hash: `/${overlayOption.route}?${args || ""}` })
  }

  browserWindow.on('move', () => {
    const [width, height] = browserWindow.getSize()
    const [x, y] = browserWindow.getPosition()
    const current = overlayMap.get(overlayOption.id)
    if (current) {
      if (current.isMaximized) {
        current.x = x
        current.y = y
        onSizePositionChange(browserWindow, overlayOption.id, {width: current.width, height: current.height}, { x, y })
        debounceSave(current)
      } else {
        current.width = width
        current.height = height
        onSizePositionChange(browserWindow, overlayOption.id, {width, height}, { x, y })
        debounceSave(current)
      }
    }
  })

  browserWindow.on("resize", () => {
    const [width, height] = browserWindow.getSize()
    const [x, y] = browserWindow.getPosition()
    const current = overlayMap.get(overlayOption.id)
    if (current) {
      if (current.isMaximized) return
      current.width = width
      current.height = height
      onSizePositionChange(browserWindow, overlayOption.id, {width, height}, { x, y })
      debounceSave(current)
    }
  })

  browserWindow.on('close', () => {
    onClose(browserWindow, overlayOption.id)
    WindowManager.windowMap.delete(overlayOption.id)
    overlayMap.delete(overlayOption.id)
  })

  browserWindow.show()

  onCreate(browserWindow, overlayOption.id)

  WindowManager.windowMap.set(overlayOption.id, browserWindow)
  overlayMap.set(overlayOption.id, overlay)
  console.log("created: " + overlayOption.id)

  if (MAIN_CONST.SHOW_CONSOLE) {
    browserWindow.webContents.openDevTools()
  }
}

ipcMain.handle('create', (
  event,
  overlayOption: IOverlayOption,
  args?: string
) => {
  createOverlay(overlayOption, args)
  return overlayOption
})

const close = (id: string) => {
  try {
    const overlayWindow = getBrowserWindow(id)
    overlayWindow.close()
  } catch (error) {
    console.log(error)
  }
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
const getOverlay = (id: string): Overlay => {
  const overlay = overlayMap.get(id)
  if (!overlay) {
    throw new Error("Overlay not found")
  }
  return overlay
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
  const overlayOption = getOverlay(id)

  overlayWindow.setAlwaysOnTop(isPinned)
  overlayWindow.setResizable(!isPinned)

  overlayOption.isPinned = isPinned
  overlayMap.set(id, overlayOption)

  onPinChange(overlayWindow, id, isPinned)
}

ipcMain.handle("pin", (event, id: string, isPinned: boolean) => {
  return pin(id, isPinned)
})

function setMaximize(id: string, overlayWindow: BrowserWindow, isMaximized: boolean, overlay?: Overlay) {
  if (isMaximized) {
    if (overlay) {
      overlay.isMaximized = true
      overlayMap.set(id, overlay)
    }

    const winBounds = overlayWindow.getBounds()
    const display = screen.getDisplayMatching(winBounds)
    const { width: screenWidth, height: screenHeight } = display.workAreaSize
    overlayWindow.setSize(screenWidth, screenHeight)
    overlayWindow.setPosition(display.bounds.x, display.bounds.y)
    console.log(display.bounds.x, display.bounds.y)
  } else {
    if (overlay) {
      overlay.isMaximized = false
      overlayMap.set(id, overlay)
      overlayWindow.setSize(overlay.width, overlay.height)
      overlayWindow.setPosition(overlay.x, overlay.y)
    }
  }
}

const maximize = (id: string, isMaximized: boolean) => {
  const overlayWindow = getBrowserWindow(id)
  const overlay = getOverlay(id)

  setMaximize(id, overlayWindow, isMaximized, overlay)
  onMaximizeChange(overlayWindow, id, isMaximized)
  debounceSave(overlay)
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
  const overlay = overlayMap.get(id)
  if (overlay?.isPinned) {
    list.push(unpinItem)
  } else {
    list.push(pinItem)
  }
  if (overlay?.isMaximized) {
    list.push(restoreItem)
  } else {
    list.push(maximizeItem)
  }
  list.push(closeItem)

  const menu = Menu.buildFromTemplate(list)
  menu.popup({ window: overlayWindow })
})