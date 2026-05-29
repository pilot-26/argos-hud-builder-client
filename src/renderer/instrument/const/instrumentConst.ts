import { EControlType, EInstrumentType, IInstrumentTemplate } from "../data/types"

export class INSTRUMENT_CONST {
    static readonly HOTAS_INPUT_2_AXIS_1_ROUTE = "HOTAS_INPUT_2_AXIS_1_ROUTE"
    static readonly HOTAS_INPUT_3_AXIS_1_ROUTE = "HOTAS_INPUT_3_AXIS_1_ROUTE"
    static readonly VIRTUAL_AXIS_1_ROUTE = "VIRTUAL_AXIS_1_ROUTE"

    static readonly INSTRUMENT_TEMPLATE_PRESET: IInstrumentTemplate[] = [
      {
        name: "HOTAS Input 2 Axis",
        type: EInstrumentType.HOTAS_INPUT,
        route: INSTRUMENT_CONST.HOTAS_INPUT_2_AXIS_1_ROUTE,
        isInteractable: false,
        fixedAspectRatio: 1,
      },
      {
        name: "HOTAS Input 3 Axis",
        type: EInstrumentType.HOTAS_INPUT,
        route: INSTRUMENT_CONST.HOTAS_INPUT_3_AXIS_1_ROUTE,
        isInteractable: false,
        fixedAspectRatio: 1,
      },
      {
        name: "Virtual Axis 1",
        type: EInstrumentType.VIRTUAL_CONTROLLER,
        route: INSTRUMENT_CONST.VIRTUAL_AXIS_1_ROUTE,
        isInteractable: true,
        controlTypeList: [EControlType.AXIS]
      }
    ]
}