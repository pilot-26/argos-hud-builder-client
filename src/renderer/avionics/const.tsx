import { getSkmrphSlider1H } from "./virtual/skin/Skmrph1/SkmrphSlider1H"
import { getSkmrphSlider1V } from "./virtual/skin/Skmrph1/SkmrphSlider1V"
import { getVirtualSlider } from "./virtual/VirtualSlider"
import { IAvionicsTemplate } from "./types"
import { EControlType } from "@shared/avionics/types"

export class AVIONICS_CONST {
  static readonly STORAGE_PATH = "Avionics"

  static readonly AVIONICS_TEMPLATE_PRESET: IAvionicsTemplate[] = [
    {
      id: "RETRO_VIRTUAL_AXIS_1_VERTICLE",
      name: "Retro Virtual Axis 1 Verticle",
      avionicsComponent: {
        getLogicElement: getVirtualSlider,
        getUIElement: getSkmrphSlider1V,
      },
      embeddedTemplate: {
        width: 200,
        height: 300,
        x: 50,
        y: 50,
        minWidth: 200,
        minHeight: 300,
        maxWidth: 300,
        maxHeight: 900,
      },
      controlTypeList: [EControlType.AXIS]
    },
    {
      id: "RETRO_VIRTUAL_AXIS_1_HORIZONTAL",
      name: "Retro Virtual Axis 1 Horizontal",
      avionicsComponent: {
        getLogicElement: getVirtualSlider,
        getUIElement: getSkmrphSlider1H,
      },
      embeddedTemplate: {
        width: 300,
        height: 200,
        x: 50,
        y: 50,
        minWidth: 300,
        minHeight: 200,
        maxWidth: 900,
        maxHeight: 300,
      },
      controlTypeList: [EControlType.AXIS]
    }
  ]
}