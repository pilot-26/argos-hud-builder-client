import { ipcMain } from 'electron'
import { TCPClient } from '../tcp/client'
import { VIRTUAL_CONST } from '../virtual/const'

let mTCPClient: TCPClient | undefined = undefined
ipcMain.handle("api-connect", async (event) => {
  if (mTCPClient) return
  
  mTCPClient = new TCPClient(VIRTUAL_CONST.DEFAULT_HOST, VIRTUAL_CONST.DEFAULT_PORT)
  await mTCPClient.connect()
})

ipcMain.handle("api-disconnect", (event) => {
  mTCPClient?.disconnect()
})

ipcMain.handle("api-send", async (event, message): Promise<void> => {
  await mTCPClient?.send(message)
})