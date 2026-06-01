import { v4 as uuidv4 } from 'uuid'
import { IEmbeddedOption, IEmbeddedTemplate } from '../types'
import { EMBEDDED_CONST } from '../const'
import { EmbeddedStorage } from '../util/embeddedStorage'

export class EmbeddedOption implements IEmbeddedOption {
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

  constructor(param: IEmbeddedTemplate) {
    this.id = uuidv4()
    this.isLocked = false
    this.width = param.width ?? EMBEDDED_CONST.DEFAULT_WIDTH
    this.height = param.height ?? EMBEDDED_CONST.DEFAULT_HEIGHT
    this.x = param.x ?? EMBEDDED_CONST.DEFAULT_POSITION_X
    this.y = param.y ?? EMBEDDED_CONST.DEFAULT_POSITION_Y
    this.fixedAspectRatio = param.fixedAspectRatio
    this.minWidth = param.minWidth
    this.minHeight = param.minHeight
    this.maxWidth = param.maxWidth
    this.maxHeight = param.maxHeight
  }

  async create(): Promise<EmbeddedOption> {
    await EmbeddedStorage.setOption(this)
    return this
  }
}