import { BrowserWindow } from "electron"

export class WindowManager {
  static mainWindow: BrowserWindow | null = null
  static windowMap: Map<string, BrowserWindow> = new Map<string, BrowserWindow>()
}