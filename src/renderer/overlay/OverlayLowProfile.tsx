import React, { useEffect, useState } from 'react'
import { GLOBAL_STYLE } from '../style/style'
import { GLOBAL_COLOR } from '../style/color'
import { Overlay } from '@shared/overlay/overlay'
import { RendererStorage } from '../util/storage'
import { OVERLAY_CONST } from '@shared/overlay/const'

export const OverlayLowProfile: React.FC<{
	overlay: Overlay,
	children?: React.ReactNode
}> = ({
	overlay,
	children
}) => {
	const [isDragging, setIsDragging] = useState(false)
	const [mouseOffset, setMouseOffset] = useState({ x: 0, y: 0 })
	const [isPinned, setIsPinned] = useState(overlay.isPinned)

	const loadOverlay = async () => {
		window.overlay.pin(overlay.id, overlay.isPinned)
		window.overlay.setSize(overlay.id, {
			width: overlay.width,
			height: overlay.height,
		})
		window.overlay.setPosition(overlay.id, {
			x: overlay.x,
			y: overlay.y,
		})
		window.overlay.maximize(overlay.id, overlay.isMaximized)

		window.overlay.receive("on-pin-change", async (id: string, isPinned: boolean) => {
			if (id !== overlay.id) return
			setIsPinned(isPinned)
		})
	}

	useEffect(() => {
		loadOverlay()
	}, [])

	useEffect(() => {
		const handleMouseMove = async (e: MouseEvent) => {
			if (isDragging) {
				const x = e.screenX - mouseOffset.x
				const y = e.screenY - mouseOffset.y
				await window.overlay.setPosition(overlay.id, {
					x: x,
					y: y,
				})
			}
		}

		const handleMouseUp = () => {
			setIsDragging(false)
		}

		if (isDragging) {
			document.addEventListener('mousemove', handleMouseMove)
			document.addEventListener('mouseup', handleMouseUp)
		}

		return () => {
			document.removeEventListener('mousemove', handleMouseMove)
			document.removeEventListener('mouseup', handleMouseUp)
		}
	}, [isDragging, mouseOffset, overlay.id])

	const handleMouseDown = async (e: React.MouseEvent) => {
		switch (e.button) {
			case 0:
				const position = await window.overlay.getPosition(overlay.id)
				if (position) {
					setMouseOffset({ x: e.screenX - position.x, y: e.screenY - position.y })
					setIsDragging(true)
				}
				return
			case 2:
				window.overlay.showContextMenu(overlay.id)
				return
		}
	}

	return (
		<div
			style={{
				position: 'absolute',
				width: '100vw',
				height: '100vh',
				boxSizing: 'border-box',
				display: "flex",
				flexDirection: "column",
				justifyContent: "center",
			}}
		>
			{!isPinned && (
				<div
					style={{
						position: 'absolute',
						top: 0,
						left: 0,
						width: '100vw',
						height: '100vh',
						display: "flex",
						flexDirection: "column",
						justifyContent: "center",

						zIndex: 1000,

						gap: GLOBAL_STYLE.GLOBAL_GAP,
						alignItems: "center",
						color: GLOBAL_COLOR.MINIMUM,
						textAlign: "center",
						alignSelf: "center",
					}}
					onMouseDown={(e) => {
						handleMouseDown(e)
					}}
					>
        </div>
			)}
			{children}
		</div>
	)
}