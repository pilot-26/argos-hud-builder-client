
import { ipcMain } from "electron"
import { startServer, stopServer } from "../virtual/server"

ipcMain.handle("start", async (event, port: number) => {
  await startServer(port)
})

ipcMain.handle("stop", (event) => {
  stopServer()
})