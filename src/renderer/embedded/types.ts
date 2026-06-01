export interface IEmbeddedTemplate {
  fixedAspectRatio?: number | undefined
  width: number,
  height: number,
  x: number,
  y: number,

  minWidth?: number
  minHeight?: number
  maxWidth?: number
  maxHeight?: number
}

export interface IEmbeddedOption extends IEmbeddedTemplate {
  id: string
  isLocked: boolean
}