import { Dashboard } from "../data/dashboard"
import { DashboardOption } from "../data/dashboardOption"
import { IDashboardOption } from "../types"

export class DashboardStorage {
  static readonly DASHBOARD_DIR = 'Dashboards'
  static async setOption(dashboardOption: IDashboardOption) {
    await window.storage.write(`${this.DASHBOARD_DIR}/${dashboardOption.id}.json`, dashboardOption)
  }
  static async set(dashboard: Dashboard) {
    const option = dashboard.getOption()
    await window.storage.write(`${this.DASHBOARD_DIR}/${option.id}.json`, option)
  }
  static async get(id: string): Promise<Dashboard | undefined> {
    try {
      const option = await window.storage.read(`${this.DASHBOARD_DIR}/${id}.json`) as DashboardOption
      const dashboard = await new Dashboard(option).build()
      return dashboard
    } catch (error) {
      console.error("Error getting dashboard:", error)
      return undefined
    }
  }
  static async list(): Promise<Dashboard[]> {
    try {
      const files = await window.storage.list(this.DASHBOARD_DIR) || []
      const list = []
      console.log(files)
      for (const each of files) {
        console.log(each)
        const option = await window.storage.read(`${this.DASHBOARD_DIR}/${each}`) as DashboardOption
        console.log(option)
        const dashboard = await new Dashboard(option).build()
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
      await window.storage.delete(`${this.DASHBOARD_DIR}/${id}.json`)
    } catch (error) {
      console.error(error)
    }
  }
}