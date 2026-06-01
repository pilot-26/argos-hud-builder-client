import { v4 as uuidv4 } from 'uuid'
import { IControl, IInstrumentTemplate } from "../../instrument/types"
import { IHUDOption } from "../types"
import { OverlayOption } from '../../overlay/data/overlayOption'
import { IOverlayTemplate } from '@shared/overlay-types'
import { HUDStorage } from '../util/HUDStorage'

/**
 * For making a new HUD option from the template
 */
export class HUDOption implements IHUDOption {
  id: string
  isOverlayEnabled: boolean
  controlList?: IControl[] | undefined
  templateId: string

  overlayTemplate: IOverlayTemplate
  overlayOptionId!: string
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
    this.overlayOptionId = this.overlayOption.id
  }

  async create(): Promise<HUDOption> {
    await this.overlayOption.create()
    await HUDStorage.setOption(this)
    return this
  }
}