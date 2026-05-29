import { IInstrument } from "../../../main/instrument/data/types"

export class InstrumentStorage {
	static async setInstrumentList(instrumentList: IInstrument[]) {
		await window.storageAPI.setInstrumentList(instrumentList)
	}
	static async getInstrumentList(): Promise<IInstrument[]> {
		const list = await window.storageAPI.getInstrumentList()
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
				await window.storageAPI.setInstrumentList([])
				return []
			}
		}
		return []
	}
}