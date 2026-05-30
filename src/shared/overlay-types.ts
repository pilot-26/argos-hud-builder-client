export interface IOverlayTemplate {
  route: string,
  isInteractable?: boolean,
  width?: number,
  height?: number,
  x?: number,
  y?: number
}

export interface IOverlayOption extends IOverlayTemplate {
  id: string
  route: string
  isMaximized: boolean
  isPinned: boolean
  isInteractable: boolean
  width: number
  height: number
  x: number
  y: number
  fixedAspectRatio?: number
}