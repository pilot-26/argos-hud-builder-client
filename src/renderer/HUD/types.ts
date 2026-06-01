import { IControl } from "../instrument/types"

/**
 * Needs to be serialized
 */
export interface IHUDOption {
	id: string
	isOverlayEnabled: boolean
	controlList?: IControl[]
	templateId: string
	overlayOptionId: string
}