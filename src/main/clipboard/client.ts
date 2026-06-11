import { TCPClient } from "../tcp/client"

import clipboardListener from "clipboard-event"
import { clipboard } from "electron"
import { decimalToHexString } from "../tcp/util"

export class ClipboardClient {
  static client: TCPClient | undefined = undefined

  static async start(host: string, port: number) {
    this.client = new TCPClient(host, port)
    await this.client.connect()

    clipboardListener.startListening()
    clipboardListener.on('change', (value) => {
      console.log("clipboard change")

      const text = clipboard.readText()
      this.client?.send(decimalToHexString(text.length/2) + text)
    })
  }
}