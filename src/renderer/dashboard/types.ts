import { IControl } from "../instrument/types"

/**
 * Needs to be serialized
 */
export interface IDashboardOption {
  id: string
  controlList?: IControl[]
  templateId: string
  embeddedOptionId: string
}