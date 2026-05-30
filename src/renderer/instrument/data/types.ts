import { Dispatch, JSX, SetStateAction } from "react"
import { IOverlayOption, IOverlayTemplate } from "../../../shared/overlay-types"

export interface IDetent {
	position: number
	label: string
}

export enum EControlType {
	AXIS = "AXIS",
	BUTTON = "BUTTON"
}
export interface IControl {
	id: string
	type: EControlType
}

export enum EInstrumentType {
	SLIDER = "SLIDER",
	JOYSTICK = "JOYSTICK",
	HOLD_BUTTON = "HOLD_BUTTON",
	TOGGLE_BUTTON = "TOGGLE_BUTTON",
	ROTATORY = "ROTATORY",
	MULTI_WAY_SWITCH = "MULTI_WAY_SWITCH",
	AXIS_INPUT_MONITOR = "AXIS_INPUT_MONITOR",
	BUTTON_INPUT_MONITOR = "BUTTON_INPUT_MONITOR",
	GAME_TELEMETRY = "GAME_TELEMETRY",
	STATIC = "STATIC"
}

export interface ILogicElementParam {
	args?: any,
	getUIElement: (...args: any[]) => JSX.Element
}
export interface IInstrumentUI {
	getLogicElement: (param: any) => JSX.Element,
	param: ILogicElementParam
}

export interface IInstrumentTemplate {
	id: string
	name: string
	instrumentUI: IInstrumentUI
	overlayTemplate: IOverlayTemplate
	controlTypeList?: EControlType[]
}

/**
 * Needs to be serialized
 */
export interface IInstrumentOption {
	id: string
	isOverlayEnabled: boolean
	controlList?: IControl[]
	templateId: string
	overlayOptionId: string
}