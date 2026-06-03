import { Panel } from "../data/penal"
import { IPanelOption } from "../types"

export class PanelStorage {
	static readonly INSTRUMENT_DIR = 'panels'
	static async setOption(panelOption: IPanelOption) {
		await window.storage.write(`${this.INSTRUMENT_DIR}/${panelOption.id}.json`, panelOption)
	}
	static async set(panel: Panel) {
		const option = panel.getOption()
		await window.storage.write(`${this.INSTRUMENT_DIR}/${option.id}.json`, option)
	}
	static async get(id: string): Promise<Panel | undefined> {
		try {
			const option = await window.storage.read(`${this.INSTRUMENT_DIR}/${id}.json`) as IPanelOption
			const overlay = await new Panel(option).build()
			return overlay
		} catch (error) {
			console.error("Error getting overlay:", error)
			return undefined
		}
	}
	static async list(): Promise<Panel[]> {
		try {
			const files = await window.storage.list(this.INSTRUMENT_DIR) || []
			const list = []
			console.log(files)
			for (const each of files) {
				console.log(each)
				const option = await window.storage.read(`${this.INSTRUMENT_DIR}/${each}`)
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
			await window.storage.delete(`${this.INSTRUMENT_DIR}/${id}.json`)
		} catch (error) {
			console.error(error)
		}
	}
}