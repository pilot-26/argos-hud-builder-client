import { JSX } from "react"
import { IEmbeddedTemplate } from "../embedded/types"
import { EControlType, IControl } from "@shared/avionics/types"

export enum EAvionicsType {
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

export interface IAvionicsComponentArg {
	params: any,
	getUIElement: (...args: any[]) => JSX.Element,
}

export interface IAvionicsComponent {
	getLogicElement: (arg: IAvionicsComponentArg) => JSX.Element,
	getUIElement: (...args: any[]) => JSX.Element,
}

export interface IAvionicsTemplate {
	id: string
	name: string
	avionicsComponent: IAvionicsComponent
	controlTypeList?: EControlType[]

	embeddedTemplate: IEmbeddedTemplate
}

export interface IAvionicsOption {
  id: string
  controlList?: IControl[]
  templateId: string
  embeddedOptionId: string
}