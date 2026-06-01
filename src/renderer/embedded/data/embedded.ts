import { IEmbeddedOption } from "../types"
import { EmbeddedStorage } from "../util/embeddedStorage"

export class Embedded implements IEmbeddedOption {
  id: string
  isLocked: boolean
  width: number
  height: number
  x: number
  y: number
  fixedAspectRatio?: number | undefined

  minWidth?: number
  minHeight?: number
  maxWidth?: number
  maxHeight?: number

  constructor(option: IEmbeddedOption) {
    this.id = option.id
    this.isLocked = option.isLocked
    this.width = option.width
    this.height = option.height
    this.x = option.x
    this.y = option.y
    this.fixedAspectRatio = option.fixedAspectRatio
    this.minWidth = option.minWidth
    this.minHeight = option.minHeight
    this.maxWidth = option.maxWidth
    this.maxHeight = option.maxHeight
  }

  static async getFromId(id: string): Promise<Embedded | undefined> {
    return await EmbeddedStorage.get(id)
  }

  async save() {
    await EmbeddedStorage.set(this)
  }

  getOption(): IEmbeddedOption {
    return {
      id: this.id,
      isLocked: this.isLocked,
      width: this.width,
      height: this.height,
      x: this.x,
      y: this.y,
      fixedAspectRatio: this.fixedAspectRatio,
      minWidth: this.minWidth,
      minHeight: this.minHeight,
      maxWidth: this.maxWidth,
      maxHeight: this.maxHeight,
    }
  }
}