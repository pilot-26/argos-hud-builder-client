import { v4 as uuidv4 } from 'uuid'
import { IAvionicsOption, IAvionicsTemplate } from "../types"
import { AVIONICS_CONST } from "../const"
import { Embedded } from "../../embedded/data/embedded"
import { IControl } from "@shared/avionics/types"
import { AAppData } from "@shared/common/appData"
import { IStorage } from '@shared/common/storage'
import { RendererStorage } from '../../util/storage'

/**
 * For filling up the blanks after getting serialized HUD option from storage
 */
export class Avionics extends AAppData implements IAvionicsOption {
  controlList?: IControl[] | undefined

  templateId: string
  embeddedOptionId: string

  template!: IAvionicsTemplate
  embedded!: Embedded

  storage: IStorage = new RendererStorage(AVIONICS_CONST.STORAGE_PATH)

  constructor (param: IAvionicsOption) {
    super(param)
    this.templateId = param.templateId
    this.embeddedOptionId = param.embeddedOptionId
    this.controlList = param.controlList
    let found = false
    for (const each of AVIONICS_CONST.AVIONICS_TEMPLATE_PRESET) {
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

  static async getFromId(id: string): Promise<Avionics | undefined> {
    const storage = new RendererStorage(AVIONICS_CONST.STORAGE_PATH)
    let option = await storage.read<IAvionicsOption>(id)

    if (!option) {
      throw new Error("OPTION NOT FOUND")
    }
    return new Avionics(option)
  }

  static async getFromTemplate(template: IAvionicsTemplate): Promise<Avionics> {
    let option: IAvionicsOption = {
        id: uuidv4(),
        controlList: undefined,
        templateId: template.id,
        embeddedOptionId: uuidv4(),
      }
    if (template.controlTypeList) {
      option.controlList = []
      for (const each of template.controlTypeList) {
        option.controlList.push({
          id: uuidv4(),
          type: each
        })
      }
    }
    option.templateId = template.id
    const avionices = new Avionics(option)
    avionices.embedded = Embedded.getFromTemplate(template.embeddedTemplate)
    avionices.embeddedOptionId = avionices.embedded.id

    return avionices
  }

  async build(): Promise<void> {
    const embedded = await Embedded.getFromId(this.embeddedOptionId)
    if (!embedded) {
      throw new Error("EMBEDDED NOT FOUND")
    }
    this.embedded = embedded
  }

  toOption(): IAvionicsOption {
    return {
      id: this.id,
      controlList: this.controlList,
      templateId: this.templateId,
      embeddedOptionId: this.embeddedOptionId
    }
  }

  async save() {
    await this.embedded.save()
    await this.storage.write(this.id, this.toOption())
  }

  async remove(): Promise<void> {
    await this.embedded.remove()
    await this.storage.delete(this.id)
  }
}