import { SkmrphSlider1H } from "../../VirtualController/skin/SkmrphSlider1H"
import { VirtualSlider } from "../../VirtualController/VirtualSlider"
import { EControlType, EInstrumentType, IInstrumentTemplate } from "../data/types"

export class INSTRUMENT_CONST {
    static readonly INSTRUMENT_ROUTE = "INSTRUMENT"

    static readonly INSTRUMENT_TEMPLATE_PRESET: IInstrumentTemplate[] = [
      {
        id: "RETRO_VIRTUAL_AXIS_1_HORIZONTAL",
        name: "Retro Virtual Axis 1 Horizontal",
        instrumentUI: {
          getLogicElement: VirtualSlider.getLogicElement,
          param: {
            getUIElement: SkmrphSlider1H.getUIElement,
          }
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
        instrumentUI: {
          getLogicElement: VirtualSlider.getLogicElement,
          param: {
            getUIElement: SkmrphSlider1H.getUIElement,
          }
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