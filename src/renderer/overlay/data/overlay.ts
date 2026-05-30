import { IOverlayOption } from "@shared/overlay-types"

export class Overlay implements IOverlayOption {
  id: string;
  route: string;
  isMaximized: boolean;
  isPinned: boolean;
  isInteractable: boolean;
  width: number;
  height: number;
  x: number;
  y: number;
  fixedAspectRatio?: number | undefined;

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
  }

  build(): Overlay {
    return this
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
      y: this.y
    }
  }
}