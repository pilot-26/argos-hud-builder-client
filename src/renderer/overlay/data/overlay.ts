import { IOverlayOption } from "@shared/overlay-types"
import { OverlayStorage } from "../util/overlayStorage"

/**
 * For filling up the blanks after getting serialized overlay option from storage
 */
export class Overlay implements IOverlayOption {
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

  static async getFromId(id: string): Promise<Overlay | undefined> {
    return await OverlayStorage.get(id)
  }

  async save() {
    await OverlayStorage.set(this)
  }

  constructor(option: IOverlayOption) {
    this.id = option.id
    this.route = option.route
    this.isMaximized = option.isMaximized
    this.isPinned = option.isPinned
    this.isInteractable = option.isInteractable
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

  getOption(): IOverlayOption {
    return {
      id: this.id,
      route: this.route,
      isMaximized: this.isMaximized,
      isPinned: this.isPinned,
      isInteractable: this.isInteractable,
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