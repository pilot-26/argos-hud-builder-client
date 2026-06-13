export enum EControlType {
	AXIS = "AXIS",
	BUTTON = "BUTTON"
}
export interface IControl {
	id: string
	type: EControlType
}