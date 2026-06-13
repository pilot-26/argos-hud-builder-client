import { v4 as uuidv4 } from 'uuid'
import { IEmbeddedOption, IEmbeddedTemplate } from "../types"
import { EMBEDDED_CONST } from '../const'
import { RendererStorage } from '../../util/storage'
import { IStorage } from '@shared/common/storage'
import { AAppBaseData } from '@shared/common/appData'

export class Embedded extends AAppBaseData implements IEmbeddedOption {
  width: number
  height: number
  x: number
  y: number
  fixedAspectRatio?: number | undefined

  minWidth?: number
  minHeight?: number
  maxWidth?: number
  maxHeight?: number

  storage: IStorage = new RendererStorage(EMBEDDED_CONST.STORAGE_PATH)

  constructor(option: IEmbeddedOption) {
    super(option)

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
    const storage = new RendererStorage(EMBEDDED_CONST.STORAGE_PATH)
    const option = await storage.read<IEmbeddedOption>(id)
    if (option) {
      return new Embedded(option)
    }
    return undefined
  }

  static getFromTemplate(template: IEmbeddedTemplate): Embedded {
    return new Embedded({
      id: uuidv4(),
      width: template.width ?? EMBEDDED_CONST.DEFAULT_WIDTH,
      height: template.height ?? EMBEDDED_CONST.DEFAULT_HEIGHT,
      x: template.x ?? EMBEDDED_CONST.DEFAULT_POSITION_X,
      y: template.y ?? EMBEDDED_CONST.DEFAULT_POSITION_Y,
      fixedAspectRatio: template.fixedAspectRatio,
      minWidth: template.minWidth,
      minHeight: template.minHeight,
      maxWidth: template.maxWidth,
      maxHeight: template.maxHeight,
    })
  }

  async save() {
    await this.storage.write(this.id, this.toOption())
  }

  async remove(): Promise<void> {
    await this.storage.delete(this.id)
  }

  toOption(): IEmbeddedOption {
    return {
      id: this.id,
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