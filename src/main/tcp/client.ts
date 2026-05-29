import net from "net"
import { TCP_CONST } from "./tcpConst"
export class TCPClient {
  client: net.Socket | undefined = undefined
  host: string
  port: number

  listener?: (data: string | Buffer) => void

  constructor(host: string, port: number) {
    this.host = host
    this.port = port
  }

  async connect() {
    if (this.client) return

    await new Promise<void>((resolve, reject) => {
      setTimeout(() => {
        console.log("Timeout connecting to server")
        this.client?.end()
        reject()
      }, TCP_CONST.DEFAULT_TIMEOUT)
      
      this.client = net.createConnection({
        host: this.host,
        port: this.port
      }, () => {
        console.log('Connected to server')
        resolve()
      })

      this.client.on("data", (data) => {
        console.log("Received data:", data.toString())
      })

      this.client.on('end', () => {
        console.log('Connection to server closed')
        this.client = undefined
      })

      this.client.on("error", (err) => {
        console.error("Error in TCP client:", err)
        this.client?.end()
        reject(err)
      })
    })
  }

  setListener(listener: (data: string | Buffer) => void) {
    this.removeListener()
    this.listener = listener
    this.client?.on("data", this.listener)
  }

  removeListener() {
    if (!this.listener) return
    this.client?.off("data", this.listener)
    this.listener = undefined
  }

  async disconnect() {
    if (!this.client) return

    await new Promise<void>((resolve, reject) => {
      this.client?.end(() => {
        this.client = undefined
        resolve()
      })
    })
  }

  async reconnectIfClosed() {
    if (this.client && !this.client.destroyed) return

    let retryCount = 0
    while (true) {
      try {
        await this.connect()
        return
      } catch (error) {
        console.error("Error connecting to server:", error)
        if (retryCount >= TCP_CONST.DEFAULT_MAX_RETRY) throw new Error("Failed to connect to server after max retry")
        retryCount++
        await new Promise(resolve => setTimeout(resolve, 1000 * retryCount))
      }
    }
  }

  async send(toSendData: string) {
    await this.reconnectIfClosed()
    if (this.client?.destroyed) return
    await new Promise<void>((resolve, reject) => {
      this.client?.write(toSendData, (err) => {
        if (err) {
          reject(err)
        } else {
          resolve()
        }
      })
    })
  }

  async sendAndReceive(toSendData: string): Promise<string | undefined> {
    await this.reconnectIfClosed()
    this.client?.write(toSendData)
    return await new Promise<string | undefined>((resolve, reject) => {
      setTimeout(() => {
        reject(undefined)
      }, TCP_CONST.DEFAULT_TIMEOUT)
      const listener = (data: string | Buffer) => {
        console.log("Received data:", data.toString())
        this.client?.off("data", listener)
        resolve(data.toString())
      }
      this.client?.on("data", listener)
    })
  }
}
