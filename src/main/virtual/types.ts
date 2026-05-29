export enum EVCommandType {
  REGISTER = "REGISTER",
  SEND_INPUT = "SEND_INPUT",
  DELETE = "DELETE"
}

export enum EVControlType {
  AXIS = "AXIS",
  BUTTON = "BUTTON"
}

export interface IVCommandMessage {
  VCommandType: EVCommandType,
  VControlId: string,
  VControlType: EVControlType,
  axisValue?: number,
  buttonValue?: boolean,
}