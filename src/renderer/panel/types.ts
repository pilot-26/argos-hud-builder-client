import { IOverlayTemplate } from "@shared/overlay-types"

/**
 * Needs to be serialized
 */
export interface IPanelOption {
	id: string
	name: string
	isOverlayEnabled: boolean
	isLocked: boolean
	overlayOptionId: string
	avionicsIdList: string[]
}

export interface IPanelTemplate {
	name: string
	overlayTemplate: IOverlayTemplate
}

export interface IPanelUserParam {
	name: string
}