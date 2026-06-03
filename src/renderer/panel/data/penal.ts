import { IPanelOption } from "../types"
import { Overlay } from "../../overlay/data/overlay"
import { PanelStorage } from "../util/penalStorage"
import { Avionics } from "../../avionics/data/avionics"
import { IAvionicsTemplate } from "../../avionics/types"
import { AvionicsOption } from "../../avionics/data/avionicsOption"
import { AvionicsStorage } from "../../avionics/util/avionicsStorage"

/**
 * For filling up the blanks after getting serialized HUD option from storage
 */
export class Panel implements IPanelOption {
  id: string
  name: string
  isOverlayEnabled: boolean
  isLocked: boolean

  overlayOptionId: string
  overlay!: Overlay

  avionicsIdList: string[] = []
  avionicsList: Avionics[] = []

  constructor (param: IPanelOption) {
    this.id = param.id
    this.name = param.name
    this.overlayOptionId = param.overlayOptionId
    this.isOverlayEnabled = param.isOverlayEnabled
    this.isLocked = param.isLocked
  }

  static async getFromId(id: string) {
    return await PanelStorage.get(id)
  }

  async build(): Promise<Panel> {
    for (const each of this.avionicsIdList) {
      const avionics = await Avionics.getFromId(each)
      if (avionics) {
        this.avionicsList.push(avionics)
      }
    }

    const overlay = await Overlay.getFromId(this.overlayOptionId)
    if (!overlay) {
      throw new Error("OVERLAY NOT FOUND")
    }
    this.overlay = overlay

    return this
  }

  getOption(): IPanelOption {
    return {
      id: this.id,
      name: this.name,
      isOverlayEnabled: this.isOverlayEnabled,
      overlayOptionId: this.overlayOptionId,
      avionicsIdList: this.avionicsIdList,
      isLocked: this.isLocked,
    }
  }

  async addAvionics(item: IAvionicsTemplate) {
    const newAvionicsOption = await new AvionicsOption(item).create()
    const newAvionics = new Avionics(newAvionicsOption)
    await newAvionics.build()
    this.avionicsIdList.push(newAvionics.id)
  }

  async removeAvionics(id: string) {
    this.avionicsIdList = this.avionicsIdList.filter(each => each !== id)
    await AvionicsStorage.remove(id)
    await this.build()
  }

  async save() {
    await this.overlay.save()
    for (const each of this.avionicsList) {
      await each.save()
    }
    await PanelStorage.set(this)
  }
}