export enum EAppType {
  SERVER = "SERVER",
  CLIENT = "CLIENT",
  SERVER_CLIENT = "SERVER_CLIENT",
}
export interface IPreference {
  AUTO_OPEN_PANEL: boolean,
  APP_TYPE: EAppType,
  VIRTUAL_HOTAS_SERVER_PREFERENCE: {
    PORT: number,
  },
  VIRTUAL_HOTAS_CLIENT_PREFERENCE: {
    HOST: string,
    PORT: number,
  },
  TELEMETRY_SERVER_PREFERENCE: {
    PORT: number
  },
  TELEMETRY_CLIENT_PREFERENCE: {
    HOST: string,
    PORT: number,
  },
  CLIPBOARD_SERVER_PREFERENCE: {
    PORT: number,
  },
  CLIPBOARD_CLIENT_PREFERENCE: {
    HOST: string,
    PORT: number,
  },
}