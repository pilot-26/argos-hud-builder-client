import { ipcMain } from 'electron'
import { FileStorage } from '../storage/fileStorage'

ipcMain.handle("write", (event, name: string, data: any) => {
  FileStorage.writeJson(name, data)
})

ipcMain.handle("read", (event, name: string) => {
  return FileStorage.readJson<any>(name) || undefined
})

ipcMain.handle("delete", (event, name: string) => {
  FileStorage.deleteFile(name)
})

ipcMain.handle("list", (event, path: string) => {
  FileStorage.listDirectory(path)
})