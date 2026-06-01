import { OVERLAY_CONST } from '../const'
import { IOverlayOption, IOverlayTemplate } from '@shared/overlay-types'
import { v4 as uuidv4 } from 'uuid'

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
  }

  build(): OverlayOption {
    return this
  }
}