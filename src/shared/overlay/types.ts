export interface IOverlayTemplate {
  route: string
  isInteractable?: boolean
  fixedAspectRatio?: number,

  width: number
  height: number
  x: number
  y: number

  minWidth?: number
  minHeight?: number
  maxWidth?: number
  maxHeight?: number
}

export interface IOverlayOption extends IOverlayTemplate {
  id: string
  route: string
  args: string
  isMaximized: boolean
  isPinned: boolean
  isInteractable: boolean
}