import { IPanelOption } from "../types"
import { Overlay } from "../../overlay/data/overlay"
import { PanelStorage } from "../util/panelStorage"
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

  overlayOptionId: string
  overlay!: Overlay

  avionicsIdList: string[] = []
  avionicsList: Avionics[] = []

  constructor (param: IPanelOption) {
    this.id = param.id
    this.name = param.name
    this.overlayOptionId = param.overlayOptionId
    this.isOverlayEnabled = param.isOverlayEnabled
    this.avionicsIdList = param.avionicsIdList
  }

  static async getFromId(id: string) {
    return await PanelStorage.get(id)
  }

  async sync() {
    const newThis = await PanelStorage.get(this.id)
    if (newThis) {
      Object.assign(this, newThis)
    }
    await this.build()
  }

  async build(): Promise<Panel> {
    this.avionicsList = []
    console.log("this.avionicsIdList = " + JSON.stringify(this.avionicsIdList))
    for (const each of this.avionicsIdList) {
      console.log("each = " + each)
      const avionics = await Avionics.getFromId(each)
      if (avionics) {
        await avionics.build()
        this.avionicsList.push(avionics)
      }
    }

    const overlay = await Overlay.getFromId(this.overlayOptionId)
    this.overlay = overlay!

    return this
  }

  getOption(): IPanelOption {
    return {
      id: this.id,
      name: this.name,
      isOverlayEnabled: this.isOverlayEnabled,
      overlayOptionId: this.overlayOptionId,
      avionicsIdList: this.avionicsIdList,
    }
  }

  async addAvionics(item: IAvionicsTemplate) {
    const newAvionicsOption = await new AvionicsOption(item).create()
    const newAvionics = new Avionics(newAvionicsOption)
    await newAvionics.build()
    this.avionicsIdList.push(newAvionics.id)
    this.avionicsList.push(newAvionics)
    await this.save()
    console.log("this.avionicsIdList = " + JSON.stringify(this.avionicsIdList))
  }

  async removeAvionics(id: string) {
    this.avionicsIdList = this.avionicsIdList.filter(each => each !== id)
    await AvionicsStorage.remove(id)
    await this.build()
  }

  async save() {
    for (const each of this.avionicsList) {
      await each.save()
    }
    await this.overlay.save()
    await PanelStorage.set(this)
  }
}