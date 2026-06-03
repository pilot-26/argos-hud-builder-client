import { IAvionicsTemplate } from "../types"
import { AVIONICS_CONST } from "../const"
import { Embedded } from "../../embedded/data/embedded"
import { AvionicsStorage } from "../util/avionicsStorage"
import { IAvionicsOption, IControl } from "@shared/avionics-types"

/**
 * For filling up the blanks after getting serialized HUD option from storage
 */
export class Avionics implements IAvionicsOption {
  id: string
  controlList?: IControl[] | undefined

  templateId: string
  embeddedOptionId: string

  template!: IAvionicsTemplate
  embedded!: Embedded

  constructor (param: IAvionicsOption) {
    this.id = param.id
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
    const option = await AvionicsStorage.get(id)
    if (option) {
      return new Avionics(option)
    }
    return undefined
  }

  async sync() {
    const newThis = await AvionicsStorage.get(this.id)
    if (newThis) {
      Object.assign(this, newThis)
    }
  }

  async build(): Promise<Avionics> {
    const embedded = await Embedded.getFromId(this.embeddedOptionId)
    if (!embedded) throw new Error()
    this.embedded = embedded
    return this
  }

  getOption(): IAvionicsOption {
    return {
      id: this.id,
      controlList: this.controlList,
      templateId: this.templateId,
      embeddedOptionId: this.embeddedOptionId
    }
  }

  async save() {
    await this.embedded.save()
    await AvionicsStorage.set(this)
  }
}