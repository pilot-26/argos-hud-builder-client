import { IStorage } from "../../shared/common/storage"
import { FileStorage } from "./fileStorage"

export class MainStorage implements IStorage {
  dir: string
  constructor(dir: string) {
    this.dir = dir
  }
  async delete(id: string): Promise<void> {
    FileStorage.deleteFile(`${this.dir}/${id}.json`)
  }
  async clear(): Promise<void> {
    FileStorage.flush()
  }
  async list(): Promise<string[]> {
    return (FileStorage.listDirectory(this.dir) || []).map(name => name.replace(/\.json$/, ''))
  }
  async read<T>(id: string): Promise<T | undefined> {
    return FileStorage.readJson<T>(`${this.dir}/${id}.json`) || undefined
  }
  async write<T>(id: string, item: T): Promise<void> {
    FileStorage.writeJson(`${this.dir}/${id}.json`, item)
  }
}