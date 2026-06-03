import { Panel } from "../data/panel"
import { IPanelOption } from "../types"

export class PanelStorage {
	static readonly PANEL_DIR = 'Panels'
	static async setOption(panelOption: IPanelOption) {
		await window.storage.write(`${this.PANEL_DIR}/${panelOption.id}.json`, panelOption)
	}
	static async set(panel: Panel) {
		const option = panel.getOption()
		await window.storage.write(`${this.PANEL_DIR}/${option.id}.json`, option)
	}
	static async get(id: string): Promise<Panel | undefined> {
		try {
			const option = await window.storage.read(`${this.PANEL_DIR}/${id}.json`) as IPanelOption
			const overlay = await new Panel(option).build()
			return overlay
		} catch (error) {
			console.error("Error getting overlay:", error)
			return undefined
		}
	}
	static async list(): Promise<Panel[]> {
		try {
			const files = await window.storage.list(this.PANEL_DIR) || []
			const list = []
			console.log(files)
			for (const each of files) {
				console.log(each)
				const option = await window.storage.read(`${this.PANEL_DIR}/${each}`)
				console.log(option)
				const panel = await new Panel(option).build()
				list.push(panel)
			}

			return list
		} catch (error) {
			console.error("Error listing HUD:", error)
			return []
		}
	}
	static async remove(id: string): Promise<void> {
		try {
			await window.storage.delete(`${this.PANEL_DIR}/${id}.json`)
		} catch (error) {
			console.error(error)
		}
	}
}