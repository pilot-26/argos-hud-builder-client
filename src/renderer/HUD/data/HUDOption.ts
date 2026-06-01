import { v4 as uuidv4 } from 'uuid'
import { IControl, IInstrumentTemplate } from "../../instrument/types"
import { IHUDOption } from "../types"
import { OverlayOption } from '../../overlay/data/overlayOption'
import { IOverlayTemplate } from '@shared/overlay-types'

export class HUDOption implements IHUDOption {
  id: string
  isOverlayEnabled: boolean
  controlList?: IControl[] | undefined
  templateId: string

  overlayTemplate: IOverlayTemplate
  overlayOptionId: string = ""
  overlayOption: OverlayOption

  constructor(pInstrumentTemplate: IInstrumentTemplate) {
    this.id = uuidv4()
    this.isOverlayEnabled = false
    if (pInstrumentTemplate.controlTypeList) {
      this.controlList = []
      for (const each of pInstrumentTemplate.controlTypeList) {
        this.controlList.push({
          id: uuidv4(),
          type: each
        })
      }
    }
    this.templateId = pInstrumentTemplate.id
    this.overlayTemplate = pInstrumentTemplate.overlayTemplate
    this.overlayOption = new OverlayOption(pInstrumentTemplate.overlayTemplate)
  }

  build(): HUDOption {
    this.overlayOption.build()
    this.overlayOptionId = this.overlayOption.id
    return this
  }
}