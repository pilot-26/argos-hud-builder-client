import { v4 as uuidv4 } from 'uuid'
import { IAvionicsTemplate } from "../types"
import { IEmbeddedTemplate } from '../../embedded/types'
import { EmbeddedOption } from '../../embedded/data/embeddedOption'
import { AvionicsStorage } from '../util/avionicsStorage'
import { IAvionicsOption, IControl } from '@shared/avionics-types'

/**
 * For making a new HUD option from the template
 */
export class AvionicsOption implements IAvionicsOption {
  id: string
  controlList?: IControl[] | undefined = undefined
  templateId: string
  
  embeddedTemplate: IEmbeddedTemplate
  embeddedOptionId!: string
  embeddedOption: EmbeddedOption

  constructor(pAvionicsTemplate: IAvionicsTemplate) {
    this.id = uuidv4()
    if (pAvionicsTemplate.controlTypeList) {
      this.controlList = []
      for (const each of pAvionicsTemplate.controlTypeList) {
        this.controlList.push({
          id: uuidv4(),
          type: each
        })
      }
    }
    this.templateId = pAvionicsTemplate.id
    this.embeddedTemplate = pAvionicsTemplate.embeddedTemplate
    this.embeddedOption = new EmbeddedOption(pAvionicsTemplate.embeddedTemplate)
    this.embeddedOptionId = this.embeddedOption.id
  }

  async create(): Promise<AvionicsOption> {
    await this.embeddedOption.create()
    await AvionicsStorage.setOption(this)
    return this
  }
}