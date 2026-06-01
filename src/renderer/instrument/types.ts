import { JSX } from "react"
import { IOverlayTemplate } from "@shared/overlay-types"
import { IEmbeddedTemplate } from "../embedded/types"

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

export interface IInstrumentComponentArg {
	params: any,
	getUIElement: (...args: any[]) => JSX.Element,
}

export interface IInstrumentComponent {
	getLogicElement: (arg: IInstrumentComponentArg) => JSX.Element,
	getUIElement: (...args: any[]) => JSX.Element,
}

export interface IInstrumentTemplate {
	id: string
	name: string
	instrumentComponent: IInstrumentComponent
	controlTypeList?: EControlType[]

	overlayTemplate: IOverlayTemplate
	embeddedTemplate: IEmbeddedTemplate
}