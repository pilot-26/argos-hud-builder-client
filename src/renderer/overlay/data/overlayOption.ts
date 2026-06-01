import { OVERLAY_CONST } from '../const'
import { IOverlayOption, IOverlayTemplate } from '@shared/overlay-types'
import { v4 as uuidv4 } from 'uuid'
import { OverlayStorage } from '../util/overlayStorage'

/**
 * For making a new overlay option from the template
 */
export class OverlayOption implements IOverlayOption {
  id: string
  route: string
  isMaximized: boolean
  isPinned: boolean
  isInteractable: boolean
  width: number
  height: number
  x: number
  y: number
  fixedAspectRatio?: number | undefined
  minWidth?: number
  minHeight?: number
  maxWidth?: number
  maxHeight?: number

  constructor(param: IOverlayTemplate) {
    this.id = uuidv4()
    this.route = param.route
    this.isMaximized = false
    this.isPinned = false
    this.isInteractable = param.isInteractable ?? false
    this.width = param.width ?? OVERLAY_CONST.DEFAULT_WIDTH
    this.height = param.height ?? OVERLAY_CONST.DEFAULT_HEIGHT
    this.x = param.x ?? OVERLAY_CONST.DEFAULT_POSITION_X
    this.y = param.y ?? OVERLAY_CONST.DEFAULT_POSITION_Y
    this.fixedAspectRatio = param.fixedAspectRatio
    this.minWidth = param.minWidth
    this.minHeight = param.minHeight
    this.maxWidth = param.maxWidth
    this.maxHeight = param.maxHeight
  }

  async create(): Promise<OverlayOption> {
    await OverlayStorage.setOption(this)
    return this
  }
}