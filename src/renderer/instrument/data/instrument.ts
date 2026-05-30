import { IControl, IInstrumentOption, IInstrumentTemplate } from "./types"
import { INSTRUMENT_CONST } from '../const/instrumentConst'
import { IOverlayOption } from "@shared/overlay-types"
import { OverlayStorage } from "../../overlay/util/overlayStorage"

export class Instrument implements IInstrumentOption {
  id: string
  isOverlayEnabled: boolean
  controlList?: IControl[] | undefined

  templateId: string
  overlayOptionId: string

  template!: IInstrumentTemplate
  overlayOption!: IOverlayOption

  constructor (instrumentOption: IInstrumentOption) {
    this.id = instrumentOption.id
    this.templateId = instrumentOption.templateId
    this.overlayOptionId = instrumentOption.overlayOptionId
    this.isOverlayEnabled = instrumentOption.isOverlayEnabled
    this.controlList = instrumentOption.controlList
    let found = false
    for (const each of INSTRUMENT_CONST.INSTRUMENT_TEMPLATE_PRESET) {
      if (each.id == this.templateId) {
        this.template = each
        found = true
        break
      }
    }
    if (!found) {
      throw new Error("TEMPLATE NOT FOUND")
    }
  }

  async build(): Promise<Instrument> {
    const overlay = await OverlayStorage.get(this.overlayOptionId)
    if (!overlay) throw new Error()
    this.overlayOption = overlay
    return this
  }

  getOption(): IInstrumentOption {
    return {
      id: this.id,
      isOverlayEnabled: this.isOverlayEnabled,
      controlList: this.controlList,
      templateId: this.templateId,
      overlayOptionId: this.overlayOptionId
    }
  }
}