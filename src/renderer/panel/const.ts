import { IPanelTemplate } from "./types";

export class PANEL_CONST {
  static readonly PANEL_ROUTE = "PANEL"
  static readonly STORAGE_PATH = "Panels"


  static readonly PANEL_TEMPLATE_PRESET: IPanelTemplate[] = [{
    name: "FULL SCREEN",
    overlayTemplate: {
      route: PANEL_CONST.PANEL_ROUTE,
      width: 500,
      height: 500,
      x: 0,
      y: 0,
    }
  }]
}