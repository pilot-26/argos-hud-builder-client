import { app } from 'electron'
import path from 'path'
import fs from 'fs'

export class FileStorage {
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

  static readJson<T>(filename: string): T | null {
    console.log("Reading JSON file:", filename)
    try {
      const filePath = path.join(FileStorage.getStorageDir(), filename)
      if (!fs.existsSync(filePath)) {
        return null
      }
      const content = fs.readFileSync(filePath, 'utf-8')
      return JSON.parse(content) as T
    } catch (error) {
      console.error(`Error reading JSON file ${filename}:`, error)
      return null
    }
  }

  static writeJson<T>(filename: string, data: T): void {
    console.log("Writing JSON file:", filename)
    try {
      const filePath = path.join(FileStorage.getStorageDir(), filename)
      FileStorage.ensureDirectory(filePath)
      fs.writeFileSync(filePath, JSON.stringify(data, null, 2), 'utf-8')
    } catch (error) {
      console.error(`Error writing JSON file ${filename}:`, error)
    }
  }

  static deleteFile(filename: string): void {
    console.log("Deleting file:", filename)
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
}