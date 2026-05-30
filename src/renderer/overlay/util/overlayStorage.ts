import { IOverlayOption } from "@shared/overlay-types"
import { Overlay } from "../data/overlay"

export class OverlayStorage {
	static readonly OVERLAY_DIR = 'Overlays'
	static async set(overlay: Overlay) {
		const option = overlay.getOption()
		await window.storageAPI.write(`${this.OVERLAY_DIR}/${option.id}.json`, option)
	}
	static async get(id: string): Promise<Overlay | undefined> {
		try {
			const option = await window.storageAPI.read(`${this.OVERLAY_DIR}/${id}.json`) as IOverlayOption
			const overlay = new Overlay(option).build()
			return overlay
		} catch (error) {
			console.error("Error getting overlay:", error)
			return undefined
		}
	}
	static async remove(id: string): Promise<void> {
		try {
			await window.storageAPI.delete(`${this.OVERLAY_DIR}/${id}.json`)
		} catch (error) {
			console.error(error)
		}
	}
}