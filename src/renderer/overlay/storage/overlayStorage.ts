import { IOverlay } from "../../../main/overlay/data/types"

export class OverlayStorage {
	static async setOverlay(overlay: IOverlay) {
		await window.storageAPI.setOverlay(overlay)
	}
	static async getOverlay(id: string): Promise<IOverlay | null> {
		try {
			return await window.storageAPI.getOverlay(id)
		} catch (error) {
			console.error("Error getting overlay:", error)
			return null
		}
	}
}