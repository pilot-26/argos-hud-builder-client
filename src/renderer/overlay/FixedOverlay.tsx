import React, { useEffect, useState, useRef } from 'react'
import { GLOBAL_COLOR } from '../style/color'
import { Overlay } from './data/overlay'

export const FixedOverlay: React.FC<{
  overlayId: string,
  children?: React.ReactNode
}> = ({
  overlayId,
  children
}) => {
  const overlayRef = useRef<Overlay | null>(null)
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
    >
      {children}
    </div>
  )
}