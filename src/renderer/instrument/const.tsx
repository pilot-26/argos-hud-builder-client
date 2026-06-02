import { getSkmrphSlider1H } from "./virtual/skin/Skmrph1/SkmrphSlider1H"
import { getSkmrphSlider1V } from "./virtual/skin/Skmrph1/SkmrphSlider1V"
import { getVirtualSlider } from "./virtual/VirtualSlider"
import { EControlType, IInstrumentTemplate } from "./types"

export class INSTRUMENT_CONST {
    static readonly INSTRUMENT_ROUTE = "INSTRUMENT"

    static readonly INSTRUMENT_TEMPLATE_PRESET: IInstrumentTemplate[] = [
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
          height: 300,
          x: 0,
          y: 0,
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
        instrumentComponent: {
          getLogicElement: getVirtualSlider,
          getUIElement: getSkmrphSlider1H,
        },
        overlayTemplate: {
          route: INSTRUMENT_CONST.INSTRUMENT_ROUTE,
          isInteractable: true,
          width: 300,
          height: 200,
          x: 0,
          y: 0,
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