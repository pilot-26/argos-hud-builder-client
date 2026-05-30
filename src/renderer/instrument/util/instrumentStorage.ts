import { Instrument } from "../data/instrument"
import { IInstrumentOption } from "../data/types"

export class InstrumentStorage {
	static readonly INSTRUMENT_DIR = 'Instruments'
	static async set(instrument: Instrument) {
		const option = instrument.getOption()
		await window.storageAPI.write(`${this.INSTRUMENT_DIR}/${option.id}.json`, option)
	}
	static async get(id: string): Promise<Instrument | undefined> {
		try {
			const option = await window.storageAPI.read(`${this.INSTRUMENT_DIR}/${id}.json`) as IInstrumentOption
			const overlay = await new Instrument(option).build()
			return overlay
		} catch (error) {
			console.error("Error getting overlay:", error)
			return undefined
		}
	}
	static async list(): Promise<Instrument[]> {
		try {
			const files = await window.storageAPI.list(this.INSTRUMENT_DIR)
			const instrumentList = []
			for (const each of files) {
				const option = await window.storageAPI.read(`${this.INSTRUMENT_DIR}/${each}.json`) as IInstrumentOption
				const instrument = await new Instrument(option).build()
				instrumentList.push(instrument)
			}

			return instrumentList
		} catch (error) {
			console.error("Error getting overlay:", error)
			return []
		}
	}
	static async remove(id: string): Promise<void> {
		try {
			await window.storageAPI.delete(`${this.INSTRUMENT_DIR}/${id}.json`)
		} catch (error) {
			console.error(error)
		}
	}
}