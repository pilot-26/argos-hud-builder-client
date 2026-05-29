import React, { useEffect, useState, useRef } from 'react'
import { GLOBAL_STYLE } from '../style/style'
import { GLOBAL_COLOR } from '../style/color'
import { OverlayStorage } from './storage/overlayStorage'
import { IOverlay } from '../../main/overlay/data/types'

const GenericOverlay: React.FC<{
	overlayId: string,
	children?: React.ReactNode
}> = ({
	overlayId,
	children
}) => {
	const [overlay, setOverlay] = useState<IOverlay | null>(null)
	const overlayRef = useRef<IOverlay | null>(null)
	const [isDragging, setIsDragging] = useState(false)
	const [mouseOffset, setMouseOffset] = useState({ x: 0, y: 0 })
	const [isHover, setIsHover] = useState(false)
	const [isPinned, setIsPinned] = useState(false)
	const saveTimeoutRef = useRef<NodeJS.Timeout | null>(null)

	const debounceSave = (overlayToSave: IOverlay) => {
		if (saveTimeoutRef.current) {
			clearTimeout(saveTimeoutRef.current)
		}
		saveTimeoutRef.current = setTimeout(() => {
			console.log("saved")
			console.log(overlayToSave)
			OverlayStorage.setOverlay(overlayToSave)
		}, 200)
	}

	const loadOverlay = async () => {
		const savedOverlay = await OverlayStorage.getOverlay(overlayId)
		if (savedOverlay) {
			setOverlay(savedOverlay)
			setIsPinned(savedOverlay.isPinned)
		}
	}

	useEffect(() => {
		overlayRef.current = overlay
	}, [overlay])

	useEffect(() => {
		loadOverlay()

		window.overlay.receive("on-pin-change", (id: string, isPinned: boolean) => {
			console.log("on-pin-change")
			console.log(id, isPinned)
			if (id !== overlayId) return
			const currentOverlay = overlayRef.current
			if (!currentOverlay) return
			const newOverlay = { ...currentOverlay, isPinned }
			setOverlay(newOverlay)
			setIsPinned(isPinned)
			debounceSave(newOverlay)
		})

		window.overlay.receive("on-position-size-change", (id: string, size: {width: number, height: number}, position: {x: number, y: number}) => {
			if (id !== overlayId) return
			const currentOverlay = overlayRef.current
			if (!currentOverlay) return
			const newOverlay = { ...currentOverlay, ...size, ...position }
			setOverlay(newOverlay)
			debounceSave(newOverlay)
		})

		window.overlay.receive("on-size-change", (id: string, width: number, height: number) => {
			if (id !== overlayId) return
			const currentOverlay = overlayRef.current
			if (!currentOverlay) return

			const newOverlay = { ...currentOverlay, width, height }
			setOverlay(newOverlay)
			debounceSave(newOverlay)
		})

		window.overlay.receive("on-maximize-change", (id: string, isMaximized: boolean) => {
			if (id !== overlayId) return
			const currentOverlay = overlayRef.current
			if (!currentOverlay) return
			const newOverlay = { ...currentOverlay, isMaximized }
			setOverlay(newOverlay)
			debounceSave(newOverlay)
		})
	}, [overlayId])

	useEffect(() => {
		const handleMouseMove = async (e: MouseEvent) => {
			if (isDragging) {
				const x = e.screenX - mouseOffset.x
				const y = e.screenY - mouseOffset.y
				await window.overlay.setPosition(overlayId, {
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
	}, [isDragging, mouseOffset, overlayId])

	const handleMouseDown = async (e: React.MouseEvent) => {
		switch (e.button) {
			case 0:
				const position = await window.overlay.getPosition(overlayId)
				if (position) {
					setMouseOffset({ x: e.screenX - position.x, y: e.screenY - position.y })
					setIsDragging(true)
				}
				return
			case 2:
				window.overlay.showContextMenu(overlayId)
				return

		}
	}

	return (
		<div
			style={{
				position: 'absolute',
				width: '100vw',
				height: '100vh',
				backgroundColor: isDragging ? GLOBAL_COLOR.MASK : "transparent",
			}}
			onMouseOver={() => {setIsHover(true)}}
			onMouseOut={() => {setIsHover(false)}}
		>
			{isHover
			&& (
				(overlay?.isInteractable === true && isPinned === false) 
				|| (overlay?.isInteractable === false)
			) && (
				<div // RESIZE AREA
					style={{
						position: 'absolute',
						top: 0,
						left: 0,
						width: '100%',
						height: '100%',
						backgroundColor: GLOBAL_COLOR.MASK_LIGHT,
						padding: GLOBAL_STYLE.GLOBAL_PADDING,

						display: "flex",
						flexDirection: "column",
						justifyContent: "center",
					}}
					onMouseDown={(e) => {
						handleMouseDown(e)
					}}
				>
					<div
						style={{
							display: "flex",
							flexDirection: "column",
							justifyContent: "center",
							alignItems: "center",
							color: GLOBAL_COLOR.MINIMUM,
							textAlign: "center",
							alignSelf: "center",
							width: "50%"
						}}
					>
						Left-click to drag, right-click to show menu
					</div>
				</div>
			)}
			{children}
		</div>
	)
}

export default GenericOverlay