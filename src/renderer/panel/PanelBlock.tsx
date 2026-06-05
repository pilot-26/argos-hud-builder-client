import React, { useEffect, useRef, useState } from 'react'
import { GLOBAL_STYLE } from '../style/style'
import { GLOBAL_COLOR } from '../style/color'
import ButtonForMouse from '../components/ButtonForMouse'
import { Panel } from './data/panel'

export const PanelBlock: React.FC<{
	item: Panel,
	onDelete?: (id: string) => void
}> = ({
	item,
	onDelete
}) => {
	const [isHover, setIsHover] = useState(false)
	const [isOverlayEnabled, setIsOverlayEnabled] = useState(false)

	const styles = {
		panelContent: {
			padding: '20px',
		},
		instrumentControlButton: {
			background: GLOBAL_COLOR.TRANSPARENT,
			color: GLOBAL_COLOR.WHITE,
			border: "none",
			padding: GLOBAL_STYLE.GLOBAL_PADDING_SMALL,
			fontWeight: "normal",
			lineHeight: "20px",
			fontSize: GLOBAL_STYLE.GLOBAL_TEXT_SECONDARY.fontSize,
		},
		instrumentControlButtonHover: {
			fontWeight: "bold",
			fontSize: GLOBAL_STYLE.GLOBAL_TEXT_PRIMARY.fontSize,
		}
	}

	useEffect(() => {
		window.overlay.receive("on-close", async (id: string) => {
			if (id !== item.overlayOptionId) return
			setIsOverlayEnabled(false)
		})
		initOverlay()
	}, [])

	const deletePanel = () => {
		onDelete?.(item.id)
	}

	const initOverlay = async () => {
		if (!item.isOverlayEnabled) return

		enableOverlay()
	}
	const enableOverlay = async () => {
		setIsOverlayEnabled(true)

		await window.storage.flush()
		await window.overlay.close(item.overlayOptionId)
		await item.sync()
		const args: any = {
			panelId: item.id
		}
		item.overlay.isPinned = true
		item.isOverlayEnabled = true
		await item.save()
		await window.storage.flush()
		window.overlay.create(item.overlay.getOption(), args)
	}

	const disableOverlay = async () => {
		setIsOverlayEnabled(false)
		await item.sync()
		item.isOverlayEnabled = false
		await item.save()
		await window.storage.flush()
		window.overlay.close(item.overlayOptionId)
	}

	const handleCustomize = async () => {
		await window.storage.flush()
		await window.overlay.close(item.overlayOptionId)
		
		await item.build()
		const args: any = {
			panelId: item.id,
			isEditMode: true
		}
		item.overlay.isPinned = false
		item.overlay.isInteractable = true
		await item.overlay.save()
		await window.overlay.create(item.overlay.getOption(), args)
	}

	const handleShow = () => {
		enableOverlay()
	}

	const handleHide = () => {
		disableOverlay()
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
				background: GLOBAL_COLOR.MASK,
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
							handleHide()
						}}
					>
						Hide
					</ButtonForMouse>
				) : (
					<ButtonForMouse
						style={styles.instrumentControlButton}
						styleHover={styles.instrumentControlButtonHover}
						onClick={() => {
							handleShow()
						}}
					>
						Show
					</ButtonForMouse>
				)}
				<ButtonForMouse
					style={styles.instrumentControlButton}
					styleHover={styles.instrumentControlButtonHover}
					onClick={() => {
						handleCustomize()
					}}
				>
					Customize
				</ButtonForMouse>
				<ButtonForMouse
					style={styles.instrumentControlButton}
					styleHover={styles.instrumentControlButtonHover}
					onClick={() => {
						deletePanel()
					}}
				>
					Delete
				</ButtonForMouse>
			</div>
		)}
		{item.name}
	</div>)
}