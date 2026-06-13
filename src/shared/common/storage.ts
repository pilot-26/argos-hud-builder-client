export interface IStorage {
  dir: string
  read<T>(id: string): Promise<T | undefined>
  write<T>(id: string,item: T): Promise<void>
  delete(id: string): Promise<void>
  list(): Promise<string[]>
}