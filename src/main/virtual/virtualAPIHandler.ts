import { ipcMain, BrowserWindow } from 'electron'
import net from "net"

let client = null

function sendToRenderer(channel: string, data: any) {

}

function connectToServer(host: string, port: number) {
  client = net.createConnection({
    host,
    port
  }, () => {
    console.log('Connected to server')
  })
}

ipcMain.handle('connect', (event, args) => {
  connectToServer(args.host, args.port)
})