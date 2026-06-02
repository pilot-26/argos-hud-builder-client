import { IControl, IInstrumentTemplate } from "../../instrument/types"
import { IDashboardOption } from "../types"
import { INSTRUMENT_CONST } from "../../instrument/const"
import { Embedded } from "../../embedded/data/embedded"
import { IEmbeddedOption } from "../../embedded/types"
import { DashboardStorage } from "../util/dashboardStorage"

/**
 * For filling up the blanks after getting serialized HUD option from storage
 */
export class Dashboard implements IDashboardOption {
  id: string
  controlList?: IControl[] | undefined

  templateId: string
  embeddedOptionId: string

  template!: IInstrumentTemplate
  embedded!: Embedded

  constructor (param: IDashboardOption) {
    this.id = param.id
    this.templateId = param.templateId
    this.embeddedOptionId = param.embeddedOptionId
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

  async build(): Promise<Dashboard> {
    const embedded = await Embedded.getFromId(this.embeddedOptionId)
    if (!embedded) throw new Error()
    this.embedded = embedded
    return this
  }

  getOption(): IDashboardOption {
    return {
      id: this.id,
      controlList: this.controlList,
      templateId: this.templateId,
      embeddedOptionId: this.embeddedOptionId
    }
  }

  async save() {
    await this.embedded.save()
    await DashboardStorage.set(this)
  }
}