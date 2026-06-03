import { v4 as uuidv4 } from 'uuid'
import { OverlayOption } from '../../overlay/data/overlayOption'
import { IOverlayTemplate } from '@shared/overlay-types'
import { IPanelOption, IPanelTemplate, IPanelUserParam } from '../types'
import { PanelStorage } from '../util/panelStorage'

/**
 * For making a new HUD option from the template
 */
export class PanelOption implements IPanelOption {
  id: string
  name: string
  isOverlayEnabled: boolean
  isLocked: boolean

  overlayTemplate: IOverlayTemplate
  overlayOptionId!: string
  overlayOption: OverlayOption

  avionicsIdList: string[] = []

  constructor(param: IPanelTemplate, userParam: IPanelUserParam) {
    this.id = uuidv4()
    this.name = userParam.name
    this.isOverlayEnabled = false
    this.isLocked = false
    
    this.overlayTemplate = param.overlayTemplate
    this.overlayOption = new OverlayOption(param.overlayTemplate)
    this.overlayOptionId = this.overlayOption.id
  }

  async create(): Promise<PanelOption> {
    await this.overlayOption.create()
    await PanelStorage.setOption(this)
    return this
  }
}