export enum EControlType {
	AXIS = "AXIS",
	BUTTON = "BUTTON"
}
export interface IControl {
	id: string
	type: EControlType
}

/**
 * Needs to be serialized
 */
export interface IAvionicsOption {
  id: string
  controlList?: IControl[]
  templateId: string
  embeddedOptionId: string
}