import React, { useEffect, useState } from 'react'
import { GLOBAL_STYLE } from '../style/style'
import { GLOBAL_COLOR } from '../style/color'
import ButtonForMouse from '../components/ButtonForMouse'
import { IOverlayOption } from '@shared/overlay-types'
import { Panel } from './data/penal'

export const PanelBlock: React.FC<{
	item: Panel,
	onDelete?: (id: string) => void
}> = ({
	item,
	onDelete
}) => {
	const [isHover, setIsHover] = useState(false)
	const [isOverlayEnabled, setIsOverlayEnabled] = useState(false)
	const [isOverlayPinned, setIsOverlayPinned] = useState(false)

	const styles = {
		panelContent: {
			padding: '20px',
		},
		instrumentControlButton: {
			backgroundColor: GLOBAL_COLOR.TRANSPARENT,
			color: GLOBAL_COLOR.WHITE,
			border: "none",
			padding: GLOBAL_STYLE.GLOBAL_PADDING_SMALL,
			fontWeight: "normal",
			lineHeight: "20px",
			fontSize: GLOBAL_STYLE.GLOBAL_FONT_SECONDARY.fontSize,
		},
		instrumentControlButtonHover: {
			fontWeight: "bold",
			fontSize: GLOBAL_STYLE.GLOBAL_FONT_PRIMARY.fontSize,
		}
	}

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

	const initOverlay = async () => {
		if (!item.isOverlayEnabled) return

		enableOverlay(item.overlay.getOption())
	}
	const enableOverlay = async (overlayOption: IOverlayOption) => {
		setIsOverlayEnabled(true)
		const args: any = {
			panelId: item.id
		}
		window.overlay.create(overlayOption, args)
		item.isOverlayEnabled = true
    item.save()
	}

	const disableOverlay = () => {
		setIsOverlayEnabled(false)
		window.overlay.close(item.overlayOptionId)
		item.isOverlayEnabled = false
    item.save()
	}

	const handleUserEnableOverlay = async () => {
		enableOverlay(item.overlay.getOption())
	}

	const handlePin = (isPinned: boolean) => {
		setIsOverlayPinned(isPinned)
		window.overlay.pin(item.overlayOptionId, isPinned)
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
				{isOverlayEnabled ? (
					<ButtonForMouse
						style={styles.instrumentControlButton}
						styleHover={styles.instrumentControlButtonHover}
						onClick={() => {
							disableOverlay()
						}}
					>
						Disable Overlay
					</ButtonForMouse>
				) : (
					<ButtonForMouse
						style={styles.instrumentControlButton}
						styleHover={styles.instrumentControlButtonHover}
						onClick={() => {
							handleUserEnableOverlay()
						}}
					>
						Enable Overlay
					</ButtonForMouse>
				)}
				{isOverlayEnabled && isOverlayPinned && (
					<ButtonForMouse
						style={styles.instrumentControlButton}
						styleHover={styles.instrumentControlButtonHover}
						onClick={() => {
							handlePin(false)
						}}
					>
						Unpin
					</ButtonForMouse>
				)}
				{isOverlayEnabled && !isOverlayPinned && (
					<ButtonForMouse
						style={styles.instrumentControlButton}
						styleHover={styles.instrumentControlButtonHover}
						onClick={() => {
							handlePin(true)
						}}
					>
						Pin
					</ButtonForMouse>
				)}
				{!isOverlayEnabled && (<ButtonForMouse
					style={styles.instrumentControlButton}
					styleHover={styles.instrumentControlButtonHover}
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