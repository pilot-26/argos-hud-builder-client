import { contextBridge, ipcRenderer } from 'electron'
import { IOverlayOption } from '../shared/overlay-types'

declare global {
  const SHOW_CONSOLE = false
  interface Window {
    main: {
      send: (channel: string, data: any) => void
      receive: (channel: string, func: (...args: any[]) => void) => void
      minimizeWindow: () => Promise<void>
      maximizeWindow: () => Promise<void>
      closeWindow: () => Promise<void>
      isWindowMaximized: () => Promise<boolean>
    },
    overlay: {
      receive: (channel: string, func: (...args: any[]) => void) => void
      create: (overlay: IOverlayOption, args?: object) => Promise<void>
      close: (id: string) => Promise<void>
      pin: (id: string, isPinned: boolean) => Promise<void>
      maximize: (id: string, isMaximized: boolean) => Promise<void>
      getPosition: (id: string) => Promise<{ x: number; y: number } | undefined>
      setPosition: (id: string, position: { x: number; y: number }) => Promise<void>
      showContextMenu: (id: string) => Promise<void>
    },
    virtualAPI: {
      connect: () => Promise<void>
      send: (message: any) => Promise<void>
      disconnect: () => Promise<void>
    },
    inputAPI: {
      connect: () => Promise<void>
      send: (message: any) => Promise<void>
      sendAndReceive: (message: any) => Promise<string | undefined>
      disconnect: () => Promise<void>
    },
    storage: {
      write: (name: string, data: any) => Promise<void>
      read: (name: string) => Promise<any | undefined>
      delete: (name: string) => Promise<void>
      list: (path: string) => Promise<string[]>
    }
  }
}

contextBridge.exposeInMainWorld('main', {
  minimizeWindow: () => ipcRenderer.invoke('minimize-window'),
  maximizeWindow: () => ipcRenderer.invoke('maximize-window'),
  closeWindow: () => ipcRenderer.invoke('close-window'),
  isWindowMaximized: () => ipcRenderer.invoke('is-window-maximized'),
})

contextBridge.exposeInMainWorld('overlay', {
  receive: (channel: string, func: (...args: any[]) => void) => {
    const validChannels = ['on-create','on-close', 'on-pin-change', 'on-maximize-change', 'on-position-size-change']
    if (validChannels.includes(channel)) {
      ipcRenderer.on(channel, (event, ...args) => func(...args))
    }
  },
  create: (id: string, overlayOption: IOverlayOption, args?: object) => ipcRenderer.invoke('create', id, overlayOption, args),
  close: (id: string) => ipcRenderer.invoke('close', id),
  pin: (id: string, isPinned: boolean) => ipcRenderer.invoke('pin', id, isPinned),
  maximize: (id: string, isMaximized: boolean) => ipcRenderer.invoke('maximize', id, isMaximized),
  getPosition: (id: string) => ipcRenderer.invoke('get-position', id),
  setPosition: (id: string, position: { x: number; y: number }) => ipcRenderer.invoke('set-position', id, position),
  showContextMenu: (id: string) => ipcRenderer.send("show-context-menu", id)
})

contextBridge.exposeInMainWorld('virtualAPI', {
  connect: () => ipcRenderer.invoke('virtual-api-connect'),
  send: (message: any) => ipcRenderer.invoke('virtual-api-send', message),
  disconnect: () => ipcRenderer.invoke('virtual-api-disconnect')
})

contextBridge.exposeInMainWorld('inputAPI', {
  connect: () => ipcRenderer.invoke('input-api-connect'),
  send: (message: any) => ipcRenderer.invoke('input-api-send', message),
  sendAndReceive: (message: any) => ipcRenderer.invoke('input-api-send-and-receive', message),
  disconnect: () => ipcRenderer.invoke('input-api-disconnect')
})

contextBridge.exposeInMainWorld('storage', {
  write: (name: string, data: any) => ipcRenderer.invoke('write', name, data),
  read: (name: string) => ipcRenderer.invoke('read', name),
  delete: (name: string) => ipcRenderer.invoke('delete', name),
  list: (path: string) => ipcRenderer.invoke('list', path)
})