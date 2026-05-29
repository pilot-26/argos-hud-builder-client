export interface IInstrumentTemplate {
	name: string,
	type: EInstrumentType,
	route: string,
	isInteractable: boolean,
	fixedAspectRatio?: number,
	controlTypeList?: EControlType[]
}

export enum EInstrumentType {
	HOTAS_INPUT = "HOTAS_INPUT",
	GAME_TELEMETRY = "GAME_TELEMERY",
	VIRTUAL_CONTROLLER = "VIRTUAL_CONTROLLER",
}

export enum EControlType {
	AXIS = "AXIS",
	BUTTON = "BUTTON"
}

export interface IControl {
	id: string
	type: EControlType
}

export interface IInstrument {
	id: string
	name: string
	type: EInstrumentType
	overlayId: string

	controlList?: IControl[]
}