import React, { useState, useRef } from 'react'
import { GLOBAL_STYLE } from '../style/style'
import { GLOBAL_COLOR } from '../style/color'
import { Embedded } from './data/embedded'

interface Position {
  x: number
  y: number
}

interface Size {
  width: number
  height: number
}

const RESIZE_HANDLE_SIZE = GLOBAL_STYLE.GLOBAL_PADDING_LARGE_NUM

export const GenericEmbedded: React.FC<{
  children?: React.ReactNode
  item: Embedded
  isLocked: boolean
  onResize?: (size: Size) => void
  onMove?: (position: Position) => void
}> = ({
  children,
  item,
  isLocked = true,
  onResize,
  onMove
}) => {
  const [embedded, setEmbedded] = useState(item)
  const [isHovered, setIsHovered] = useState(false)
  const [position, setPosition] = useState<Position>({ x: item.x, y: item.y })
  const [size, setSize] = useState<Size>({ width: item.width, height: item.height })
  const [isDragging, setIsDragging] = useState(false)
  const [isResizing, setIsResizing] = useState(false)
  const [resizeDirection, setResizeDirection] = useState<'n' | 's' | 'e' | 'w' | 'ne' | 'nw' | 'se' | 'sw' | null>(null)
  const dragStartRef = useRef<Position>({ x: 0, y: 0 })
  const initialPositionRef = useRef<Position>({ x: 0, y: 0 })
  const initialSizeRef = useRef<Size>({ width: 0, height: 0 })
  const containerRef = useRef<HTMLDivElement>(null)
  const saveTimeoutRef = useRef<NodeJS.Timeout | null>(null)

  const debounceSave = (embeddedToSave: Embedded) => {
    if (saveTimeoutRef.current) {
      clearTimeout(saveTimeoutRef.current)
    }
    saveTimeoutRef.current = setTimeout(() => {
      console.log("saved")
      console.log(embeddedToSave)
      embeddedToSave.save()
    }, 200)
  }

  const getResizeDirection = (e: React.MouseEvent | React.TouchEvent): 'n' | 's' | 'e' | 'w' | 'ne' | 'nw' | 'se' | 'sw' | null => {
    const rect = containerRef.current?.getBoundingClientRect()
    if (!rect) return null

    const clientX = 'touches' in e ? e.touches[0].clientX : e.clientX
    const clientY = 'touches' in e ? e.touches[0].clientY : e.clientY

    const x = clientX - rect.left
    const y = clientY - rect.top

    const isLeft = x < RESIZE_HANDLE_SIZE
    const isRight = x > rect.width - RESIZE_HANDLE_SIZE
    const isTop = y < RESIZE_HANDLE_SIZE
    const isBottom = y > rect.height - RESIZE_HANDLE_SIZE

    if (isTop && isLeft) return 'nw'
    if (isTop && isRight) return 'ne'
    if (isBottom && isLeft) return 'sw'
    if (isBottom && isRight) return 'se'
    if (isTop) return 'n'
    if (isBottom) return 's'
    if (isLeft) return 'w'
    if (isRight) return 'e'
    return null
  }

  const handleMouseDown = (e: React.MouseEvent) => {
    if (isLocked) {
      return
    }

    e.preventDefault()
    setIsHovered(true)

    if ((e.target as HTMLElement).classList.contains('resize-handle')) return

    const direction = getResizeDirection(e)
    if (direction) {
      e.preventDefault()
      setIsResizing(true)
      setResizeDirection(direction)
      dragStartRef.current = { x: e.clientX, y: e.clientY }
      initialPositionRef.current = { x: position.x, y: position.y }
      initialSizeRef.current = { width: size.width, height: size.height }
      return
    }

    setIsDragging(true)
    dragStartRef.current = { x: e.clientX - position.x, y: e.clientY - position.y }
  }

  const handleTouchStart = (e: React.TouchEvent) => {
    if (isLocked) {
      return
    }

    e.preventDefault()
    setIsHovered(true)

    const direction = getResizeDirection(e)
    if (direction) {
      e.preventDefault()
      setIsResizing(true)
      setResizeDirection(direction)
      dragStartRef.current = { x: e.touches[0].clientX, y: e.touches[0].clientY }
      initialPositionRef.current = { x: position.x, y: position.y }
      initialSizeRef.current = { width: size.width, height: size.height }
      return
    }

    setIsDragging(true)
    dragStartRef.current = { x: e.touches[0].clientX - position.x, y: e.touches[0].clientY - position.y }
  }

  const handleTouchMove = (e: TouchEvent) => {
    if (isLocked) {
      return
    }
    e.preventDefault()
    
    if (isDragging) {
      const newX = e.touches[0].clientX - dragStartRef.current.x
      const newY = e.touches[0].clientY - dragStartRef.current.y
      const x = Math.max(0, newX)
      const y = Math.max(0, newY)
      setPosition({ x, y })
      onMove?.({ x, y })

      setEmbedded(new Embedded({...embedded, x, y}))
      debounceSave(embedded)
    } else if (isResizing && resizeDirection) {
      const deltaX = e.touches[0].clientX - dragStartRef.current.x
      const deltaY = e.touches[0].clientY - dragStartRef.current.y

      let newWidth = initialSizeRef.current.width
      let newHeight = initialSizeRef.current.height
      let newX = initialPositionRef.current.x
      let newY = initialPositionRef.current.y

      if (resizeDirection.includes('e')) {
        newWidth = Math.max(item.minWidth ?? 0, Math.min(item.maxWidth ?? Infinity, initialSizeRef.current.width + deltaX))
      }
      if (resizeDirection.includes('w')) {
        newWidth = Math.max(item.minWidth ?? 0, Math.min(item.maxWidth ?? Infinity, initialSizeRef.current.width - deltaX))
        newX = initialPositionRef.current.x + (initialSizeRef.current.width - newWidth)
      }
      if (resizeDirection.includes('s')) {
        newHeight = Math.max(item.minHeight ?? 0, Math.min(item.maxHeight ?? Infinity, initialSizeRef.current.height + deltaY))
      }
      if (resizeDirection.includes('n')) {
        newHeight = Math.max(item.minHeight ?? 0, Math.min(item.maxHeight ?? Infinity, initialSizeRef.current.height - deltaY))
        newY = initialPositionRef.current.y + (initialSizeRef.current.height - newHeight)
      }

      setSize({ width: newWidth, height: newHeight })
      setPosition({ x: newX, y: newY })
      onMove?.({ x: newX, y: newY })
      onResize?.({ width: newWidth, height: newHeight })

      setEmbedded(new Embedded({...embedded, x: newX, y: newY, width: newWidth, height: newHeight}))
      debounceSave(embedded)
    }
  }

  const handleMouseUp = () => {
    if (isLocked) {
      return
    }
    setIsDragging(false)
    setIsResizing(false)
    setResizeDirection(null)
  }

  const handleTouchEnd = () => {
    if (isLocked) {
      return
    }
    setIsDragging(false)
    setIsResizing(false)
    setResizeDirection(null)
  }

  React.useEffect(() => {
    if (isLocked) {
      return
    }

    const handleMouseMove = (e: MouseEvent) => {
      if (isDragging) {
        const newX = e.clientX - dragStartRef.current.x
        const newY = e.clientY - dragStartRef.current.y
        setPosition({ x: Math.max(0, newX), y: Math.max(0, newY) })
        onMove?.({ x: Math.max(0, newX), y: Math.max(0, newY) })
      } else if (isResizing && resizeDirection) {
        const deltaX = e.clientX - dragStartRef.current.x
        const deltaY = e.clientY - dragStartRef.current.y

        let newWidth = initialSizeRef.current.width
        let newHeight = initialSizeRef.current.height
        let newX = initialPositionRef.current.x
        let newY = initialPositionRef.current.y

        if (resizeDirection.includes('e')) {
          newWidth = Math.max(item.minWidth ?? 0, Math.min(item.maxWidth ?? Infinity, initialSizeRef.current.width + deltaX))
        }
        if (resizeDirection.includes('w')) {
          newWidth = Math.max(item.minWidth ?? 0, Math.min(item.maxWidth ?? Infinity, initialSizeRef.current.width - deltaX))
          newX = initialPositionRef.current.x + (initialSizeRef.current.width - newWidth)
        }
        if (resizeDirection.includes('s')) {
          newHeight = Math.max(item.minHeight ?? 0, Math.min(item.maxHeight ?? Infinity, initialSizeRef.current.height + deltaY))
        }
        if (resizeDirection.includes('n')) {
          newHeight = Math.max(item.minHeight ?? 0, Math.min(item.maxHeight ?? Infinity, initialSizeRef.current.height - deltaY))
          newY = initialPositionRef.current.y + (initialSizeRef.current.height - newHeight)
        }

        setSize({ width: newWidth, height: newHeight })
        setPosition({ x: newX, y: newY })
        onMove?.({ x: newX, y: newY })
        onResize?.({ width: newWidth, height: newHeight })

        setEmbedded(new Embedded({...embedded, x: newX, y: newY, width: newWidth, height: newHeight}))
        debounceSave(embedded)
      }
    }

    if (isDragging || isResizing) {
      document.addEventListener('mousemove', handleMouseMove)
      document.addEventListener('mouseup', handleMouseUp)
      document.addEventListener('touchmove', handleTouchMove)
      document.addEventListener('touchend', handleTouchEnd)
      return () => {
        document.removeEventListener('mousemove', handleMouseMove)
        document.removeEventListener('mouseup', handleMouseUp)
        document.removeEventListener('touchmove', handleTouchMove)
        document.removeEventListener('touchend', handleTouchEnd)
      }
    }
  }, [isDragging, isResizing, handleMouseUp, handleTouchMove, handleTouchEnd, embedded])

  const handleMouseEnter = (e: React.MouseEvent) => {
    if (isLocked) {
      return
    }
    
    e.preventDefault()
    setIsHovered(true)
  }

  const handleMouseLeave = () => {
    if (isLocked) {
      return
    }

    setIsHovered(false)
  }

  return (
    <div
      ref={containerRef}
      style={{
        position: 'absolute',
        left: position.x,
        top: position.y,
        width: size.width,
        height: size.height,
        overflow: "visible",
        borderRadius: '8px',
        zIndex: 100,
      }}
      onMouseOver={handleMouseEnter}
      onMouseOut={handleMouseLeave}
      onMouseDown={handleMouseDown}
      onTouchStart={handleTouchStart}
    >
      {isHovered && <div
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: "rgba(0, 0, 0, 0.5)",
          zIndex: 998,
          border: `2px dashed ${GLOBAL_COLOR.MINIMUM}`,
          padding: RESIZE_HANDLE_SIZE,
        }}
      >
        <div
          style={{
            width: "100%",
            height: "100%",
            border: `2px dashed ${GLOBAL_COLOR.MINIMUM}`,
            background: "rgba(0, 0, 0, 0.5)",
            zIndex: 999,
            color: GLOBAL_COLOR.MINIMUM,
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            textAlign: "center",
            whiteSpace: "pre-wrap",
            padding: GLOBAL_STYLE.GLOBAL_PADDING
          }}
        >
          {`Drag to move/resize`}
          
        </div>
      </div>}
      <div
        className="resize-handle"
        style={{
          position: 'absolute',
          bottom: 0,
          right: 0,
          width: RESIZE_HANDLE_SIZE,
          height: RESIZE_HANDLE_SIZE,
          borderTopLeftRadius: '4px',
          cursor: 'se-resize'
        }}
      />

      <div
        className="resize-handle"
        style={{
          position: 'absolute',
          top: 0,
          right: 0,
          width: RESIZE_HANDLE_SIZE,
          height: RESIZE_HANDLE_SIZE,
          borderBottomLeftRadius: '4px',
          cursor: 'ne-resize'
        }}
      />

      <div
        className="resize-handle"
        style={{
          position: 'absolute',
          bottom: 0,
          left: 0,
          width: RESIZE_HANDLE_SIZE,
          height: RESIZE_HANDLE_SIZE,
          borderTopRightRadius: '4px',
          cursor: 'sw-resize'
        }}
      />

      <div
        className="resize-handle"
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          width: RESIZE_HANDLE_SIZE,
          height: RESIZE_HANDLE_SIZE,
          borderBottomRightRadius: '4px',
          cursor: 'nw-resize'
        }}
      />

      <div
        className="resize-handle"
        style={{
          position: 'absolute',
          bottom: 0,
          left: RESIZE_HANDLE_SIZE,
          right: RESIZE_HANDLE_SIZE,
          height: RESIZE_HANDLE_SIZE,
          cursor: 's-resize'
        }}
      />

      <div
        className="resize-handle"
        style={{
          position: 'absolute',
          top: RESIZE_HANDLE_SIZE,
          bottom: RESIZE_HANDLE_SIZE,
          right: 0,
          width: RESIZE_HANDLE_SIZE,
          cursor: 'e-resize'
        }}
      />

      <div
        className="resize-handle"
        style={{
          position: 'absolute',
          top: RESIZE_HANDLE_SIZE,
          bottom: RESIZE_HANDLE_SIZE,
          left: 0,
          width: RESIZE_HANDLE_SIZE,
          cursor: 'w-resize'
        }}
      />

      <div
        className="resize-handle"
        style={{
          position: 'absolute',
          top: 0,
          left: RESIZE_HANDLE_SIZE,
          right: RESIZE_HANDLE_SIZE,
          height: RESIZE_HANDLE_SIZE,
          cursor: 'n-resize'
        }}
      />
      <div style={{
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        overflow: "visible",
        width: '100%',
        height: '100%',
        padding: '12px',
      }}>
        {children}
      </div>
    </div>
  )
}