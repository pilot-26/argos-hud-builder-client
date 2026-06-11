import { Server, Socket } from "net"
import { hexStringToDecimal } from "../tcp/util"
import { clipboard } from "electron"

export class ClipboardServer {
  static server: Server | null = null
  
  static async start(port: number) {
    this.server = new Server()
    this.server.listen(port, () => {
      console.log(`Clipboard server is on port ${port}`)
    })
    this.server.on("connection", (socket) => {
      console.log("Clipboard server connected")
      socket.on("data", (data) => {
        console.log("Received data:", data.toString())
        const length = hexStringToDecimal(data.toString().substring(0, 4))
        const text = data.toString().substring(4, 4 + length)
        console.log("Received text:", text)
        clipboard.writeText(text)
      })
      socket.on("close", () => {
        console.log("Client disconnected")
      })
      socket.on("error", (err) => {
        console.error("Client error:", err)
      })
    })
    this.server.on("close", () => {
      console.log("Clipboard server closed")
    })
    this.server.on("error", (err) => {
      console.error("Clipboard server error:", err)
    } )
   }
}
