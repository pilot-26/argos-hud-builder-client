import { Instrument } from "../data/instrument"
import { IInstrumentOption } from "../data/types"

export class InstrumentStorage {
	static readonly INSTRUMENT_DIR = 'Instruments'
	static async set(instrument: Instrument) {
		const option = instrument.getOption()
		await window.storage.write(`${this.INSTRUMENT_DIR}/${option.id}.json`, option)
	}
	static async get(id: string): Promise<Instrument | undefined> {
		try {
			const option = await window.storage.read(`${this.INSTRUMENT_DIR}/${id}.json`) as IInstrumentOption
			const overlay = await new Instrument(option).build()
			return overlay
		} catch (error) {
			console.error("Error getting overlay:", error)
			return undefined
		}
	}
	static async list(): Promise<Instrument[]> {
		try {
			const files = await window.storage.list(this.INSTRUMENT_DIR) || []
			const instrumentList = []
			console.log(files)
			for (const each of files) {
				console.log(each)
				const option = await window.storage.read(`${this.INSTRUMENT_DIR}/${each}`)
				console.log(option)
				const instrument = await new Instrument(option).build()
				instrumentList.push(instrument)
			}

			return instrumentList
		} catch (error) {
			console.error("Error listing instruments:", error)
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