import { IControl, IInstrumentTemplate } from "../../instrument/types"
import { IOverlayOption } from "@shared/overlay-types"
import { OverlayStorage } from "../../overlay/util/overlayStorage"
import { IHUDOption } from "../types"
import { INSTRUMENT_CONST } from "../../instrument/const"

export class HUD implements IHUDOption {
  id: string
  isOverlayEnabled: boolean
  controlList?: IControl[] | undefined

  templateId: string
  overlayOptionId: string

  template!: IInstrumentTemplate
  overlayOption!: IOverlayOption

  constructor (param: IHUDOption) {
    this.id = param.id
    this.templateId = param.templateId
    this.overlayOptionId = param.overlayOptionId
    this.isOverlayEnabled = param.isOverlayEnabled
    this.controlList = param.controlList
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

  async build(): Promise<HUD> {
    const overlay = await OverlayStorage.get(this.overlayOptionId)
    if (!overlay) throw new Error()
    this.overlayOption = overlay
    return this
  }

  getOption(): IHUDOption {
    return {
      id: this.id,
      isOverlayEnabled: this.isOverlayEnabled,
      controlList: this.controlList,
      templateId: this.templateId,
      overlayOptionId: this.overlayOptionId
    }
  }
}