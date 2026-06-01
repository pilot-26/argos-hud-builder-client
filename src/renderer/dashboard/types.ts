import { IControl } from "../instrument/types"

/**
 * Needs to be serialized
 */
export interface IDashboardOption {
  id: string
  isEmbeddedLocked: boolean
  controlList?: IControl[]
  templateId: string
  embeddedOptionId: string
}