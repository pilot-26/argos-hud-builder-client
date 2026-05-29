import { IOverlay } from "./data/types"

export class OverlayStorage {
	static readonly OVERLAY_DIR = 'overlays'
	static async setOverlay(overlay: IOverlay) {
		await window.storageAPI.write(`${this.OVERLAY_DIR}/${overlay.id}.json`, overlay)
	}
	static async getOverlay(id: string): Promise<IOverlay | undefined> {
		try {
			return await window.storageAPI.read(`${this.OVERLAY_DIR}/${id}.json`)
		} catch (error) {
			console.error("Error getting overlay:", error)
			return undefined
		}
	}
}