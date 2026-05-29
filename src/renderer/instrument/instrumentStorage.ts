import { IInstrument } from "./data/types"

const INSTRUMENT_LIST_FILENAME = 'instrumentList.json'

export class InstrumentStorage {
	static async setInstrumentList(instrumentList: IInstrument[]) {
		await window.storageAPI.write(INSTRUMENT_LIST_FILENAME, instrumentList)
	}
	static async getInstrumentList(): Promise<IInstrument[]> {
		const list = await window.storageAPI.read(INSTRUMENT_LIST_FILENAME) as IInstrument[]
		if (list) {
			try {
				const newList: IInstrument[] = []
				let isNeedResave = false
				for (const item of list) {
					if (!item.id) {
						isNeedResave = true
						continue
					}
					newList.push(item)
				}
				if (isNeedResave) {
					await InstrumentStorage.setInstrumentList(newList)
				}
				return newList
			} catch (error) {
				console.error("Error parsing instrument list:", error)
				await InstrumentStorage.setInstrumentList([])
				return []
			}
		}
		return []
	}
}