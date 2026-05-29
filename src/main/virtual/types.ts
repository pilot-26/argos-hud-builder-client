export enum ECommandType {
  REGISTER = "REGISTER",
  SEND_AXIS_INPUT = "SEND_AXIS_INPUT",
  SEND_BUTTON_INPUT = "SEND_BUTTON_INPUT",
  DELETE = "DELETE"
}

export interface ICommandMessage {
  type: ECommandType,
  id: string,
  axisValue?: number,
  buttonValue?: boolean,
}