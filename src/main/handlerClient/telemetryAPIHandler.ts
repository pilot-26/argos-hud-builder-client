import { ipcMain } from 'electron'
import { TCPClient } from '../tcp/client'
import { TELEMETRY_CONST } from '../telemetry/const'

let mTCPClient: TCPClient | undefined = undefined
ipcMain.handle("input-api-connect", async (event) => {
  if (mTCPClient) {
    await mTCPClient.disconnect()
    mTCPClient = undefined
  }
  mTCPClient = new TCPClient(TELEMETRY_CONST.DEFAULT_HOST, TELEMETRY_CONST.DEFAULT_PORT)
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