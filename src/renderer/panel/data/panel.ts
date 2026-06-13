import { IPanelOption, IPanelTemplate, IPanelUserParam } from "../types"
import { Avionics } from "../../avionics/data/avionics"
import { IAvionicsTemplate } from "../../avionics/types"
import { Overlay } from "@shared/overlay/overlay"
import { OVERLAY_CONST } from "@shared/overlay/const"
import { RendererStorage } from "../../util/storage"
import { v4 as uuidv4 } from 'uuid'
import { PANEL_CONST } from "../const"
import { AAppData } from "@shared/common/appData"

export class Panel extends AAppData implements IPanelOption {
  id: string
  name: string
  isOverlayEnabled: boolean

  overlayOptionId: string
  overlay!: Overlay

  avionicsIdList: string[] = []
  avionicsList: Avionics[] = []

  storage = new RendererStorage(PANEL_CONST.STORAGE_PATH)

  constructor (param: IPanelOption) {
    super(param)

    this.id = param.id
    this.name = param.name
    this.overlayOptionId = param.overlayOptionId
    this.isOverlayEnabled = param.isOverlayEnabled
    this.avionicsIdList = param.avionicsIdList || []
  }

  static async list(): Promise<Panel[]> {
    const storage = new RendererStorage(PANEL_CONST.STORAGE_PATH)
    const panels = await storage.list()
    const list = []
    for (const each of panels) {
      const panelOption = await storage.read<IPanelOption>(each)
      if (panelOption) {
        const panel = new Panel(panelOption)
        await panel.build()
        list.push(panel)
      }
    }
    console.log(list)
    return list
  }

  static async getFromId(id: string): Promise<Panel | null> {
    const storage = new RendererStorage(PANEL_CONST.STORAGE_PATH)
    const panel = await storage.read<IPanelOption>(id)
    if (panel) {
      return new Panel(panel)
    }
    return null
  }

  static async getFromTemplate(template: IPanelTemplate, userParam: IPanelUserParam): Promise<Panel> {
    const overlay = Overlay.getFromTemplate(template.overlayTemplate, new RendererStorage(OVERLAY_CONST.STORAGE_DIR))
    const panel = new Panel({
      id: uuidv4(),
      name: userParam.name,
      isOverlayEnabled: false,
      overlayOptionId: overlay.id,
      avionicsIdList: [],
    })
    panel.overlay = overlay
    return panel
  }

  async build(): Promise<void> {
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

    const overlay = await Overlay.getFromId(this.overlayOptionId, new RendererStorage(OVERLAY_CONST.STORAGE_DIR))
    this.overlay = overlay!
  }

  toOption(): IPanelOption {
    return {
      id: this.id,
      name: this.name,
      isOverlayEnabled: this.isOverlayEnabled,
      overlayOptionId: this.overlayOptionId,
      avionicsIdList: this.avionicsIdList,
    }
  }

  async addAvionics(item: IAvionicsTemplate) {
    const newAvionics = await Avionics.getFromTemplate(item)
    this.avionicsIdList.push(newAvionics.id)
    this.avionicsList.push(newAvionics)
    await this.save()
    console.log("this.avionicsIdList = " + JSON.stringify(this.avionicsIdList))
  }

  async removeAvionics(id: string) {
    this.avionicsIdList = this.avionicsIdList.filter(each => each !== id)
    await this.build()
  }

  async save() {
    for (const each of this.avionicsList) {
      await each.save()
    }
    await this.overlay.save()
    await this.storage.write(this.id, this.toOption())
  }

  async remove(): Promise<void> {
    await this.storage.delete(this.id)
  }
}