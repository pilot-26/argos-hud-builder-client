import { app } from 'electron'
import path from 'path'
import fs from 'fs'

export class FileStorage {
  private static cache = new Map<string, any>()
  private static pendingWrites = new Map<string, NodeJS.Timeout>()
  private static readonly DEBOUNCE_MS = 500

  private static getStorageDir(): string {
    const userDataPath = app.getPath('userData')
    const storageDir = path.join(userDataPath, 'storage')
    if (!fs.existsSync(storageDir)) {
      fs.mkdirSync(storageDir, { recursive: true })
    }
    return storageDir
  }

  private static ensureDirectory(dirPath: string, isDirectory: boolean = false): void {
    const targetDir = isDirectory ? dirPath : path.dirname(dirPath)
    if (!fs.existsSync(targetDir)) {
      fs.mkdirSync(targetDir, { recursive: true })
    }
  }

  private static doWrite(filename: string): void {
    const data = FileStorage.cache.get(filename)
    if (data === undefined) return

    try {
      const filePath = path.join(FileStorage.getStorageDir(), filename)
      FileStorage.ensureDirectory(filePath)
      fs.writeFileSync(filePath, JSON.stringify(data, null, 2), 'utf-8')
    } catch (error) {
      console.error(`Error writing JSON file ${filename}:`, error)
    }
  }

  static readJson<T>(filename: string): T | null {
    console.log("Reading JSON file:", filename)
    if (FileStorage.cache.has(filename)) {
      return FileStorage.cache.get(filename) as T
    }
    try {
      const filePath = path.join(FileStorage.getStorageDir(), filename)
      if (!fs.existsSync(filePath)) {
        return null
      }
      const content = fs.readFileSync(filePath, 'utf-8')
      console.log(content)
      const parsed = JSON.parse(content)
      console.log(parsed)
      console.log(typeof parsed)
      const data = JSON.parse(content) as T
      FileStorage.cache.set(filename, data)
      return data
    } catch (error) {
      console.error(`Error reading JSON file ${filename}:`, error)
      return null
    }
  }

  static writeJson<T>(filename: string, data: T): void {
    console.log("Writing JSON file:", filename)
    FileStorage.cache.set(filename, data)

    if (FileStorage.pendingWrites.has(filename)) {
      clearTimeout(FileStorage.pendingWrites.get(filename))
    }

    const timeout = setTimeout(() => {
      FileStorage.pendingWrites.delete(filename)
      FileStorage.doWrite(filename)
    }, FileStorage.DEBOUNCE_MS)

    FileStorage.pendingWrites.set(filename, timeout)
  }

  static flush(): void {
    console.log("Flushing all pending writes")
    for (const [filename, timeout] of FileStorage.pendingWrites) {
      clearTimeout(timeout)
      FileStorage.pendingWrites.delete(filename)
      FileStorage.doWrite(filename)
    }
  }

  static deleteFile(filename: string): void {
    console.log("Deleting file:", filename)
    FileStorage.cache.delete(filename)
    if (FileStorage.pendingWrites.has(filename)) {
      clearTimeout(FileStorage.pendingWrites.get(filename))
      FileStorage.pendingWrites.delete(filename)
    }
    try {
      const filePath = path.join(FileStorage.getStorageDir(), filename)
      if (fs.existsSync(filePath)) {
        fs.unlinkSync(filePath)
      }
    } catch (error) {
      console.error(`Error deleting file ${filename}:`, error)
    }
  }

  static listDirectory(dirName: string): string[] | undefined {
    console.log("Listing directory:", dirName)
    try {
      const dirPath = path.join(FileStorage.getStorageDir(), dirName)
      FileStorage.ensureDirectory(dirPath, true)
      fs.accessSync(dirPath)
      const files = fs.readdirSync(dirPath)
      return files
    } catch (error) {
      console.error(error)
    }
  }

  static clear(): void {
    console.log("Clearing all files")
    FileStorage.cache.clear()
    FileStorage.pendingWrites.clear()
    FileStorage.flush()
    try {
      fs.rmdirSync(FileStorage.getStorageDir())
    } catch (error) {
      console.error(`Error deleting storage directory:`, error)
    }
  }
}