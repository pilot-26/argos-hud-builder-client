import { HUD } from "../data/HUD"
import { IHUDOption } from "../types"

export class HUDStorage {
	static readonly INSTRUMENT_DIR = 'HUDs'
	static async setOption(hudOption: IHUDOption) {
		await window.storage.write(`${this.INSTRUMENT_DIR}/${hudOption.id}.json`, hudOption)
	}
	static async set(hud: HUD) {
		const option = hud.getOption()
		await window.storage.write(`${this.INSTRUMENT_DIR}/${option.id}.json`, option)
	}
	static async get(id: string): Promise<HUD | undefined> {
		try {
			const option = await window.storage.read(`${this.INSTRUMENT_DIR}/${id}.json`) as IHUDOption
			const overlay = await new HUD(option).build()
			return overlay
		} catch (error) {
			console.error("Error getting overlay:", error)
			return undefined
		}
	}
	static async list(): Promise<HUD[]> {
		try {
			const files = await window.storage.list(this.INSTRUMENT_DIR) || []
			const list = []
			console.log(files)
			for (const each of files) {
				console.log(each)
				const option = await window.storage.read(`${this.INSTRUMENT_DIR}/${each}`)
				console.log(option)
				const hud = await new HUD(option).build()
				list.push(hud)
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