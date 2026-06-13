import { AAppBaseData, IAppDataOption } from "../common/appData"
import { IStorage } from "../common/storage"
import { IOverlayOption, IOverlayTemplate } from "./types"
import { v4 as uuidv4 } from 'uuid'

export class Overlay extends AAppBaseData implements IOverlayOption {
  route: string
  args: string
  isMaximized: boolean
  isPinned: boolean
  isInteractable: boolean
  width: number
  height: number
  x: number
  y: number
  fixedAspectRatio?: number | undefined
  minWidth?: number
  minHeight?: number
  maxWidth?: number
  maxHeight?: number

  storage: IStorage

  constructor(option: IOverlayOption, storage: IStorage) {
    super(option)

    this.route = option.route
    this.args = option.args
    this.isMaximized = option.isMaximized
    this.isPinned = option.isPinned
    this.isInteractable = option.isInteractable
    this.width = option.width
    this.height = option.height
    this.x = option.x
    this.y = option.y
    this.fixedAspectRatio = option.fixedAspectRatio
    this.minWidth = option.minWidth
    this.minHeight = option.minHeight
    this.maxWidth = option.maxWidth
    this.maxHeight = option.maxHeight

    this.storage = storage
  }

  static async getList(storage: IStorage): Promise<Overlay[]> {
    const idList = await storage.list()
    console.log("idList = " + JSON.stringify(idList))
    const list = []
    for (const each of idList) {
      const overlay = await Overlay.getFromId(each, storage)
      if (!overlay) continue
      list.push(overlay)
    }
    return list
  }

  static async getFromId(id: string, storage: IStorage): Promise<Overlay | undefined> {
    const option = await storage.read<IOverlayOption>(id)
    return option ? new Overlay(option, storage) : undefined
  }

  static getFromTemplate(param: IOverlayTemplate, storage: IStorage): Overlay {
    return new Overlay({
      id: uuidv4(),
      route: param.route,
      args: '',
      isMaximized: false,
      isPinned: false,
      isInteractable: param.isInteractable || false,
      width: param.width,
      height: param.height,
      x: param.x,
      y: param.y,
    }, storage)
  }

  async save() {
    await this.storage.write(this.id, this.toOption())
  }

  async remove(): Promise<void> {
    await this.storage.delete(this.id)
  }

  toOption(): IOverlayOption {
    return {
      id: this.id,
      route: this.route,
      args: this.args,
      isMaximized: this.isMaximized,
      isPinned: this.isPinned,
      isInteractable: this.isInteractable,
      width: this.width,
      height: this.height,
      x: this.x,
      y: this.y,
      fixedAspectRatio: this.fixedAspectRatio,
      minWidth: this.minWidth,
      minHeight: this.minHeight,
      maxWidth: this.maxWidth,
      maxHeight: this.maxHeight,
    }
  }
}