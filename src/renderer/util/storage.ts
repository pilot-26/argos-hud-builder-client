import { IStorage } from "@shared/common/storage"

export class RendererStorage implements IStorage {
  dir: string
  constructor(dir: string) {
    this.dir = dir
  }
  async delete(id: string): Promise<void> {
    await window.storage.delete(`${this.dir}/${id}.json`)
  }
  async list(): Promise<string[]> {
    return (await window.storage.list(this.dir)).map(name => name.replace(/\.json$/, ''))
  }
  async read<T>(id: string): Promise<T | undefined> {
    return await window.storage.read(`${this.dir}/${id}.json`) as T
  }
  async write<T>(id: string, item: T): Promise<void> {
    await window.storage.write(`${this.dir}/${id}.json`, item)
  }
}