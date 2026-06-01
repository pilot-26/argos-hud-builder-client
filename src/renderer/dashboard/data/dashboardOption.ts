import { v4 as uuidv4 } from 'uuid'
import { IControl, IInstrumentTemplate } from "../../instrument/types"
import { IDashboardOption } from "../types"
import { IEmbeddedTemplate } from '../../embedded/types'
import { EmbeddedOption } from '../../embedded/data/embeddedOption'
import { DashboardStorage } from '../util/dashboardStorage'

/**
 * For making a new HUD option from the template
 */
export class DashboardOption implements IDashboardOption {
  id: string
  isEmbeddedLocked: boolean = false
  controlList?: IControl[] | undefined = undefined
  templateId: string
  
  embeddedTemplate: IEmbeddedTemplate
  embeddedOptionId!: string
  embeddedOption: EmbeddedOption

  constructor(pInstrumentTemplate: IInstrumentTemplate) {
    this.id = uuidv4()
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
    this.embeddedTemplate = pInstrumentTemplate.embeddedTemplate
    this.embeddedOption = new EmbeddedOption(pInstrumentTemplate.embeddedTemplate)
    this.embeddedOptionId = this.embeddedOption.id
  }

  async create(): Promise<DashboardOption> {
    await this.embeddedOption.create()
    await DashboardStorage.setOption(this)
    return this
  }
}