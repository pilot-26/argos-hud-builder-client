import { Avionics } from "../data/avionics"
import { IAvionicsOption } from "@shared/avionics-types"

export class AvionicsStorage {
  static readonly AVIONICS_DIR = 'Avionics'
  static async setOption(dashboardOption: IAvionicsOption) {
    await window.storage.write(`${this.AVIONICS_DIR}/${dashboardOption.id}.json`, dashboardOption)
  }
  static async set(dashboard: Avionics) {
    const option = dashboard.getOption()
    await window.storage.write(`${this.AVIONICS_DIR}/${option.id}.json`, option)
  }
  static async get(id: string): Promise<Avionics | undefined> {
    try {
      const option = await window.storage.read(`${this.AVIONICS_DIR}/${id}.json`) as IAvionicsOption
      const dashboard = await new Avionics(option).build()
      return dashboard
    } catch (error) {
      console.error("Error getting dashboard:", error)
      return undefined
    }
  }
  static async list(): Promise<Avionics[]> {
    try {
      const files = await window.storage.list(this.AVIONICS_DIR) || []
      const list = []
      console.log(files)
      for (const each of files) {
        console.log(each)
        const option = await window.storage.read(`${this.AVIONICS_DIR}/${each}`) as IAvionicsOption
        console.log(option)
        const dashboard = await new Avionics(option).build()
        list.push(dashboard)
      }

      return list
    } catch (error) {
      console.error("Error listing dashboard:", error)
      return []
    }
  }
  static async remove(id: string): Promise<void> {
    try {
      await window.storage.delete(`${this.AVIONICS_DIR}/${id}.json`)
    } catch (error) {
      console.error(error)
    }
  }
}