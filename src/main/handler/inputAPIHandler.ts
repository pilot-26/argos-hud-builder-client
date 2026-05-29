import { ipcMain } from 'electron'
import { TCPClient } from '../tcp/client'

let mTCPClient: TCPClient | undefined = undefined
ipcMain.handle("input-api-connect", async (event, option) => {
  if (mTCPClient) {
    await mTCPClient.disconnect()
    mTCPClient = undefined
  }
  mTCPClient = new TCPClient(option.host, option.port)
  await mTCPClient.connect()
})

ipcMain.handle("input-api-disconnect", (event) => {
  mTCPClient?.disconnect()
})

ipcMain.handle("input-api-send", async (event, message): Promise<void> => {
  await mTCPClient?.send(message)
})

ipcMain.handle("input-api-send-and-receive", async (event, message): Promise<string | undefined> => {
  return await mTCPClient?.sendAndReceive(message)
})