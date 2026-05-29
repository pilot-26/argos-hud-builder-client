import { ipcMain } from 'electron'
import { TCPClient } from '../tcp/client'

let mTCPClient: TCPClient | undefined = undefined
ipcMain.handle("virtual-api-connect", async (event, option) => {
  if (mTCPClient) return
  
  mTCPClient = new TCPClient(option.host, option.port)
  await mTCPClient.connect()
})

ipcMain.handle("virtual-api-disconnect", (event) => {
  mTCPClient?.disconnect()
})

ipcMain.handle("virtual-api-send", async (event, message): Promise<void> => {
  await mTCPClient?.send(message)
})