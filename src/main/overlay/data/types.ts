export interface IOverlay {
  id: string
  monitorID?: string
  route: string
  
  isEnabled: boolean
  isMaximized: boolean
  isPinned: boolean
  isInteractable: boolean
  width: number
  height: number
  x: number
  y: number
  fixedAspectRatio?: number
}
