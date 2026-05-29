import { contextBridge, ipcRenderer } from 'electron'
import { IAxisInput, IButtonInput } from './virtual/types'
import { IOverlayOption } from './overlay/data/types'

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
      getActiveList: () => Promise<string[]>
      create: (overlay: IOverlayOption) => Promise<number>
      close: (id: string) => Promise<number>
      pin: (id: string, isPinned: boolean) => Promise<number>
      maximize: (id: string, isMaximized: boolean) => Promise<number>
      getPosition: (id: string) => Promise<{ x: number; y: number } | undefined>
      setPosition: (id: string, position: { x: number; y: number }) => Promise<number>
      showContextMenu: (id: string) => void
    },
    virtualAPI: {
      connect: (host: string, port: number) => Promise<void>
      sendAxisInput: (input: IAxisInput) => Promise<void>
      sendButtonInput: (input: IButtonInput) => Promise<void>
    },
    SDLAPI: {
      connect: (host: string, port: number) => Promise<void>
    },
    storageAPI: {
      write: (name: string, data: any) => Promise<void>
      read: (name: string) => Promise<any | undefined>
    }
  }
}

contextBridge.exposeInMainWorld('main', {
  send: (channel: string, data: any) => {
    const validChannels = ['toMain']
    if (validChannels.includes(channel)) {
      ipcRenderer.send(channel, data)
    }
  },
  receive: (channel: string, func: (...args: any[]) => void) => {
    const validChannels = ['fromMain']
    if (validChannels.includes(channel)) {
      ipcRenderer.on(channel, (event, ...args) => func(...args))
    }
  },
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
  getActiveList: () => ipcRenderer.invoke('get-active-list'),
  create: (overlay: IOverlayOption) => ipcRenderer.invoke('create', overlay),
  close: (id: string) => ipcRenderer.invoke('close', id),
  pin: (id: string, isPinned: boolean) => ipcRenderer.invoke('pin', id, isPinned),
  maximize: (id: string, isMaximized: boolean) => ipcRenderer.invoke('maximize', id, isMaximized),
  getPosition: (id: string) => ipcRenderer.invoke('get-position', id),
  setPosition: (id: string, position: { x: number; y: number }) => ipcRenderer.invoke('set-position', id, position),
  showContextMenu: (id: string) => ipcRenderer.send("show-context-menu", id)
})

contextBridge.exposeInMainWorld('virtualAPI', {
  connect: (host: string, port: number) => ipcRenderer.invoke('connect', { host, port }),
  createController: () => ipcRenderer.invoke('create-controller'),
  sendAxisInput: (input: IAxisInput) => ipcRenderer.invoke('send-axis-input', input),
  sendButtonInput: (input: IButtonInput) => ipcRenderer.invoke('send-button-input', input)
})

contextBridge.exposeInMainWorld('SDLAPI', {
  connect: (host: string, port: number) => ipcRenderer.invoke('connect', { host, port })
})

contextBridge.exposeInMainWorld('storageAPI', {
  write: (name: string, data: any) => ipcRenderer.invoke('wrtie', name, data),
  read: (name: string) => ipcRenderer.invoke('read', name),
})