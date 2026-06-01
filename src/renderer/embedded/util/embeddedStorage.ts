import { IEmbeddedOption } from "../types"
import { Embedded } from "../data/embedded"

export class EmbeddedStorage {
	static readonly EMBEDDED_DATA_DIR = 'Embedded'
  
	static async setOption(embeddedOption: IEmbeddedOption) {
		await window.storage.write(`${this.EMBEDDED_DATA_DIR}/${embeddedOption.id}.json`, embeddedOption)
	}
	static async set(embedded: Embedded) {
		const option = embedded.getOption()
		await window.storage.write(`${this.EMBEDDED_DATA_DIR}/${option.id}.json`, option)
	}
	static async get(id: string): Promise<Embedded | undefined> {
		try {
			const option = await window.storage.read(`${this.EMBEDDED_DATA_DIR}/${id}.json`) as IEmbeddedOption
			const embedded = new Embedded(option)
			return embedded
		} catch (error) {
			console.error("Error getting embedded:", error)
			return undefined
		}
	}
	static async remove(id: string): Promise<void> {
		try {
			await window.storage.delete(`${this.EMBEDDED_DATA_DIR}/${id}.json`)
		} catch (error) {
			console.error(error)
		}
	}
}