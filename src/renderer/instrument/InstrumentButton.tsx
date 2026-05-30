import React, { useEffect, useState } from 'react'
import { GLOBAL_STYLE } from '../style/style'
import { GLOBAL_COLOR } from '../style/color'
import ButtonForMouse from '../components/ButtonForMouse'
import { instrumentPanelStyle } from '../instrument/InstrumentPanelStyle'
import { Instrument } from './data/instrument'
import { OverlayStorage } from '../overlay/util/overlayStorage'
import { OverlayOption } from '../overlay/data/overlayOption'
import { IOverlayOption } from '@shared/overlay-types'

const InstrumentButton: React.FC<{
	item: Instrument,
	onDelete?: (id: string) => void
}> = ({
	item,
	onDelete
}) => {
	const [isHover, setIsHover] = useState(false)
	const [isOverlayEnabled, setIsOverlayEnabled] = useState(false)
	const [isOverlayPinned, setIsOverlayPinned] = useState(false)

	useEffect(() => {
		window.overlay.receive("on-create", (id: string) => {
			if (id !== item.overlayOptionId) return
			setIsOverlayEnabled(true)
		})

		window.overlay.receive("on-close", async (id: string) => {
			if (id !== item.overlayOptionId) return
			setIsOverlayEnabled(false)
		})

		window.overlay.receive("on-pin-change", async (id: string, isPinned: boolean) => {
			if (id !== item.overlayOptionId) return
			setIsOverlayPinned(isPinned)
		})

		initOverlay()
	}, [])

	const deleteInstrument = () => {
		onDelete?.(item.id)
	}

	const getOverlayFromStorage = async () => {
		return await OverlayStorage.get(item.overlayOptionId)
	}
	const initOverlay = async () => {
		if (!item.isOverlayEnabled) return

		enableOverlay(item.overlayOption)
	}
	const enableOverlay = async (overlayOption: IOverlayOption) => {
		setIsOverlayEnabled(true)
		const args: any = {
			templateId: item.templateId
		}
		item.controlList?.forEach((each, index) => {
			args[`controlId${index}`] = each.id
		})
		window.overlay.create(overlayOption, args)
	}

	const disableOverlay = () => {
		setIsOverlayEnabled(false)
		window.overlay.close(item.overlayOptionId)
	}

	const handleUserEnableOverlay = async () => {
		const savedOverlay = await getOverlayFromStorage()
		if (!savedOverlay) return

		enableOverlay(savedOverlay)
	}

	const handlePin = (isPinned: boolean) => {
		setIsOverlayPinned(isPinned)
		window.overlay.pin(item.overlayOptionId, isPinned)
	}

	return (<div
		key={item.template.name}
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
				{isOverlayEnabled ? (
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
				{isOverlayEnabled && isOverlayPinned && (
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
				{isOverlayEnabled && !isOverlayPinned && (
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
				{!isOverlayEnabled && (<ButtonForMouse
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
		{item.template.name}
	</div>)
}

export default InstrumentButton
