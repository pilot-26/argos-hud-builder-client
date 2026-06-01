import { getSkmrphSlider1H } from "./virtual/skin/Skmrph1/SkmrphSlider1H"
import { getSkmrphSlider1V } from "./virtual/skin/Skmrph1/SkmrphSlider1V"
import { getVirtualSlider, VirtualSlider } from "./virtual/VirtualSlider"
import { EControlType, IInstrumentTemplate } from "./types"

export class INSTRUMENT_CONST {
    static readonly INSTRUMENT_ROUTE = "INSTRUMENT"

    static readonly INSTRUMENT_TEMPLATE_PRESET: IInstrumentTemplate[] = [
      {
        id: "RETRO_VIRTUAL_AXIS_1_HORIZONTAL",
        name: "Retro Virtual Axis 1 Horizontal",
        instrumentComponent: {
          getLogicElement: getVirtualSlider,
          getUIElement: getSkmrphSlider1H,
        },
        overlayTemplate: {
          route: INSTRUMENT_CONST.INSTRUMENT_ROUTE,
          isInteractable: true,
          width: 600,
          height: 300
        },
        controlTypeList: [EControlType.AXIS]
      },
      {
        id: "RETRO_VIRTUAL_AXIS_1_VERTICLE",
        name: "Retro Virtual Axis 1 Verticle",
        instrumentComponent: {
          getLogicElement: getVirtualSlider,
          getUIElement: getSkmrphSlider1V,
        },
        overlayTemplate: {
          route: INSTRUMENT_CONST.INSTRUMENT_ROUTE,
          isInteractable: true,
          width: 600,
          height: 300
        },
        controlTypeList: [EControlType.AXIS]
      }
    ]
}