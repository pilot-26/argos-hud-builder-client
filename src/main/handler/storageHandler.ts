import { ipcMain } from 'electron'
import { FileStorage } from '../storage/fileStorage'

ipcMain.handle("wrtie", (event, name: string, data: any) => {
  FileStorage.writeJson(name, data)
})

ipcMain.handle("read", (event, name: string) => {
  return FileStorage.readJson<any>(name) || undefined
})