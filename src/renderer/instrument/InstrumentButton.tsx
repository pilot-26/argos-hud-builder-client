import React, { useEffect, useState } from 'react'
import { IInstrument } from '../instrument/data/types'
import { GLOBAL_STYLE } from '../style/style'
import { GLOBAL_COLOR } from '../style/color'
import ButtonForMouse from '../components/ButtonForMouse'
import { instrumentPanelStyle } from '../instrument/InstrumentPanelStyle'
import { OverlayStorage } from '../overlay/overlayStorage'
import { IOverlay } from '../overlay/data/types'

const InstrumentButton: React.FC<{
	item: IInstrument,
	onDelete?: (id: string) => void
}> = ({
	item,
	onDelete
}) => {
	const [isHover, setIsHover] = useState(false)
	const [isEnabled, setIsEnabled] = useState(false)
	const [isPinned, setIsPinned] = useState(false)

	const saveOverlay = async (overlay: IOverlay) => {
		console.log("saved Overlay", overlay)
		OverlayStorage.setOverlay(overlay)
	}

	const initOverlay = async () => {
		const savedOverlay = await OverlayStorage.getOverlay(item.overlayId)
		if (!savedOverlay) return
		console.log("savedOverlay", savedOverlay)

		setIsEnabled(savedOverlay.isEnabled)
		setIsPinned(savedOverlay.isPinned)
		if (savedOverlay.isEnabled) {
			enableOverlay(savedOverlay)
		}
	}

	const loadOverlay = async () => {
		const savedOverlay = await OverlayStorage.getOverlay(item.overlayId)
		if (!savedOverlay) return

		savedOverlay.isEnabled = true
		saveOverlay(savedOverlay)
	}

	useEffect(() => {
		window.overlay.receive("on-create", (id: string) => {
			if (id !== item.overlayId) return
			setIsEnabled(true)

			loadOverlay()
		})

		window.overlay.receive("on-close", async (id: string) => {
			console.log("on-close")
			console.log(id)
			console.log(item.overlayId)
			if (id !== item.overlayId) return
			setIsEnabled(false)

			const savedOverlay = await OverlayStorage.getOverlay(item.overlayId)
			console.log("savedOverlay", savedOverlay)
			if (!savedOverlay) return

			savedOverlay.isEnabled = false
			saveOverlay(savedOverlay)
		})

		window.overlay.receive("on-pin-change", async (id: string, isPinned: boolean) => {
			if (id !== item.overlayId) return
			setIsPinned(isPinned)
			const savedOverlay = await OverlayStorage.getOverlay(item.overlayId)
			if (!savedOverlay) return
			savedOverlay.isPinned = isPinned
			saveOverlay(savedOverlay)
		})

		initOverlay()
	}, [])

	const deleteInstrument = () => {
		onDelete?.(item.id)
	}

	const enableOverlay = async (overlay: IOverlay) => {
		setIsEnabled(true)
		const args: any = {}
		item.controlList?.forEach((each, index) => {
			args[`controlId${index}`] = each.id
		})
		window.overlay.create(overlay, args)
	}

	const handleUserEnableOverlay = async () => {
		const savedOverlay = await OverlayStorage.getOverlay(item.overlayId)
		if (!savedOverlay) return

		enableOverlay(savedOverlay)
	}

	const disableOverlay = () => {
		setIsEnabled(false)
		window.overlay.close(item.overlayId)
	}

	const handlePin = (isPinned: boolean) => {
		setIsPinned(isPinned)
		window.overlay.pin(item.overlayId, isPinned)
	}

	return (<div
		key={item.name}
		style={{
			position: 'relative',
			border: "none",
			borderRadius: GLOBAL_STYLE.GLOBAL_BORDER_RADIUS_SMALL,
			padding: GLOBAL_STYLE.GLOBAL_PADDING_SMALL,
			height: '50vh',
			display: "flex",
			flexDirection: "column",
			justifyContent: "center",
			alignItems: "center",
		}}
		onMouseOver={() => setIsHover(true)}
		onMouseOut={() => setIsHover(false)}
	>
		{isHover && (
			<div style={{
				position: 'absolute',
				top: 0,
				left: 0,
				width: '100%',
				height: '100%',
				backgroundColor: GLOBAL_COLOR.MASK,
				backdropFilter: 'blur(10px)',
				borderRadius: GLOBAL_STYLE.GLOBAL_BORDER_RADIUS_SMALL,
				display: "flex",
				flexDirection: "column",
				justifyContent: "center",
				alignItems: "center",
			}}>
				{isEnabled ? (
					<ButtonForMouse
						style={instrumentPanelStyle.instrumentControlButton}
						styleHover={instrumentPanelStyle.instrumentControlButtonHover}
						onClick={() => {
							disableOverlay()
						}}
					>
						Disable Overlay
					</ButtonForMouse>
				) : (
					<ButtonForMouse
						style={instrumentPanelStyle.instrumentControlButton}
						styleHover={instrumentPanelStyle.instrumentControlButtonHover}
						onClick={() => {
							handleUserEnableOverlay()
						}}
					>
						Enable Overlay
					</ButtonForMouse>
				)}
				{isEnabled && isPinned && (
					<ButtonForMouse
						style={instrumentPanelStyle.instrumentControlButton}
						styleHover={instrumentPanelStyle.instrumentControlButtonHover}
						onClick={() => {
							handlePin(false)
						}}
					>
						Unpin
					</ButtonForMouse>
				)}
				{isEnabled && !isPinned && (
					<ButtonForMouse
						style={instrumentPanelStyle.instrumentControlButton}
						styleHover={instrumentPanelStyle.instrumentControlButtonHover}
						onClick={() => {
							handlePin(true)
						}}
					>
						Pin
					</ButtonForMouse>
				)}
				{!isEnabled && (<ButtonForMouse
					style={instrumentPanelStyle.instrumentControlButton}
					styleHover={instrumentPanelStyle.instrumentControlButtonHover}
					onClick={() => {
						deleteInstrument()
					}}
				>
					Delete
				</ButtonForMouse>)}
			</div>
		)}
		{item.name}
	</div>)
}

export default InstrumentButton
