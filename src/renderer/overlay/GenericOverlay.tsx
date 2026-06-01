import React, { useEffect, useState, useRef } from 'react'
import { GLOBAL_STYLE } from '../style/style'
import { GLOBAL_COLOR } from '../style/color'
import { Overlay } from './data/overlay'

const GenericOverlay: React.FC<{
	overlayId: string,
	children?: React.ReactNode
}> = ({
	overlayId,
	children
}) => {
	const [overlay, setOverlay] = useState<Overlay | null>(null)
	const overlayRef = useRef<Overlay | null>(null)
	const [isDragging, setIsDragging] = useState(false)
	const [mouseOffset, setMouseOffset] = useState({ x: 0, y: 0 })
	const [isHover, setIsHover] = useState(false)
	const [isPinned, setIsPinned] = useState(false)
	const saveTimeoutRef = useRef<NodeJS.Timeout | null>(null)

	const debounceSave = () => {
		if (saveTimeoutRef.current) {
			clearTimeout(saveTimeoutRef.current)
		}
		saveTimeoutRef.current = setTimeout(() => {
			console.log("saved")
			overlayRef.current?.save()
		}, 200)
	}

	const loadOverlay = async () => {
		const savedOverlay = await Overlay.getFromId(overlayId)
		if (savedOverlay) {
			setOverlay(savedOverlay)
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
			const newOverlay = new Overlay({ ...currentOverlay, isPinned })
			console.log("saved")
			setOverlay(newOverlay)
			setIsPinned(isPinned)
			debounceSave()
		})

		window.overlay.receive("on-position-size-change", (id: string, size: {width: number, height: number}, position: {x: number, y: number}) => {
			if (id !== overlayId) return
			const currentOverlay = overlayRef.current
			if (!currentOverlay) return
			const newOverlay = new Overlay({ ...currentOverlay, width: size.width, height: size.height, x: position.x, y: position.y  })
			setOverlay(newOverlay)
			debounceSave()
		})

		window.overlay.receive("on-maximize-change", (id: string, isMaximized: boolean) => {
			if (id !== overlayId) return
			const currentOverlay = overlayRef.current
			if (!currentOverlay) return
			const newOverlay = new Overlay({ ...currentOverlay, isMaximized })
			setOverlay(newOverlay)
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
				background: isPinned ? "transparent" : GLOBAL_COLOR.MASK,
				border: isPinned ? "1px solid transparent" : `1px solid ${GLOBAL_COLOR.MINIMUM}`,
				boxSizing: 'border-box'
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
						width: '100vw',
						height: '100vh',
						background: GLOBAL_COLOR.MASK_LIGHT,
						padding: GLOBAL_STYLE.GLOBAL_PADDING,

						display: "flex",
						flexDirection: "column",
						justifyContent: "center",

						zIndex: 1000,
					}}
					onMouseDown={(e) => {
						handleMouseDown(e)
					}}
					>
						<div
							style={{
								justifyContent: "center",
								alignItems: "center",
								color: GLOBAL_COLOR.MINIMUM,
								textAlign: "center",
								alignSelf: "center",
								width: "50%",
								whiteSpace: "pre-wrap"
							}}
						>
							{`Left-click to drag\nRight-click to show menu\nPin after done setting`}
						</div>
					</div>
			)}
			{children}
		</div>
	)
}

export default GenericOverlay