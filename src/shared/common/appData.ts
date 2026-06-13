import { IStorage } from "./storage"

export interface IAppDataOption {
  id: string
}
export abstract class AAppBaseData {
  id: string
  abstract storage: IStorage

  constructor (param: IAppDataOption) {
    this.id = param.id
  }

  async sync(): Promise<void> {
    const newThis = await this.storage.read<IAppDataOption>(this.id)
    if (newThis) {
      Object.assign(this, newThis)
    }
  }

  abstract remove(): Promise<void>
  abstract save(): Promise<void>
  abstract toOption(): IAppDataOption
}
export abstract class AAppData extends AAppBaseData {
  override async sync(): Promise<void> {
    await super.sync()
    await this.build()
  }
  abstract build(): Promise<void>
}