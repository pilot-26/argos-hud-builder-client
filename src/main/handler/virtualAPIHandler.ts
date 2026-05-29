import { ipcMain } from 'electron'
import net from "net"

let client: net.Socket | undefined = undefined

function connectToServer(host: string, port: number) {
  client = net.createConnection({
    host,
    port
  }, () => {
    console.log('Connected to server')
  })
}

function disconnectFromServer() {
  client?.end()
}

ipcMain.handle("connect", (event, option) => {
  connectToServer(option.host, option.port)
})

ipcMain.handle("disconnect", (event) => {
  disconnectFromServer()
})

ipcMain.handle("send", async (event, message) => {
  client?.write(JSON.stringify(message))
})