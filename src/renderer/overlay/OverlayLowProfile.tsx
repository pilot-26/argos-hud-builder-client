import React, { useEffect, useState, useRef } from 'react'
import { GLOBAL_STYLE } from '../style/style'
import { GLOBAL_COLOR } from '../style/color'
import { Overlay } from './data/overlay'

export const OverlayLowProfile: React.FC<{
	overlayId: string,
	children?: React.ReactNode
}> = ({
	overlayId,
	children
}) => {
	const overlayRef = useRef<Overlay | null>(null)
	const [isDragging, setIsDragging] = useState(false)
	const [mouseOffset, setMouseOffset] = useState({ x: 0, y: 0 })
	const [isPinned, setIsPinned] = useState(false)
	const saveTimeoutRef = useRef<NodeJS.Timeout | null>(null)

	const debounceSave = () => {
		if (saveTimeoutRef.current) {
			clearTimeout(saveTimeoutRef.current)
		}
		saveTimeoutRef.current = setTimeout(() => {
			console.log("saved")
			overlayRef.current?.save()
		}, 500)
	}

	const loadOverlay = async () => {
		const savedOverlay = await Overlay.getFromId(overlayId)
		if (savedOverlay) {
			overlayRef.current = savedOverlay
			setIsPinned(savedOverlay.isPinned)
			window.overlay.pin(overlayId, savedOverlay.isPinned)
			window.overlay.setSize(overlayId, {
				width: savedOverlay.width,
				height: savedOverlay.height,
			})
			window.overlay.setPosition(overlayId, {
				x: savedOverlay.x,
				y: savedOverlay.y,
			})
			window.overlay.maximize(overlayId, savedOverlay.isMaximized)
		}
	}

	useEffect(() => {
		loadOverlay()

		window.overlay.receive("on-pin-change", (id: string, isPinned: boolean) => {
			console.log("on-pin-change")
			console.log(id, isPinned)
			if (id !== overlayId) return
			const currentOverlay = overlayRef.current
			if (!currentOverlay) return
			const newOverlay = new Overlay({ ...currentOverlay, isPinned })
			console.log("saved")
			overlayRef.current = newOverlay
			setIsPinned(isPinned)
			debounceSave()
		})

		window.overlay.receive("on-position-size-change", (id: string, size: {width: number, height: number}, position: {x: number, y: number}) => {
			if (id !== overlayId) return
			const currentOverlay = overlayRef.current
			if (!currentOverlay) return
			const newOverlay = new Overlay({ ...currentOverlay, width: size.width, height: size.height, x: position.x, y: position.y  })
			overlayRef.current = newOverlay
			debounceSave()
		})

		window.overlay.receive("on-maximize-change", (id: string, isMaximized: boolean) => {
			if (id !== overlayId) return
			const currentOverlay = overlayRef.current
			if (!currentOverlay) return
			const newOverlay = new Overlay({ ...currentOverlay, isMaximized })
			overlayRef.current = newOverlay
			debounceSave()
		})
	}, [])

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