export interface IInstrumentTemplate {
	name: string,
	type: EInstrumentType,
	route: string,
	isInteractable: boolean,
	fixedAspectRatio?: number,
	axisCount?: number,
	buttonCount?: number
}

export enum EInstrumentType {
	HOTAS_INPUT = "HOTAS_INPUT",
	GAME_TELEMETRY = "GAME_TELEMERY",
	VIRTUAL_CONTROLLER = "VIRTUAL_CONTROLLER",
}

export interface IInstrument {
	id: string
	name: string
	type: EInstrumentType
	overlayId: string

	axisList?: []
	buttonList?: []
}