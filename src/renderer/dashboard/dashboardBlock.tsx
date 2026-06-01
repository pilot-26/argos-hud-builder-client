import React, { useState, useRef } from 'react'
import { GLOBAL_STYLE } from '../style/style'
import { GLOBAL_COLOR } from '../style/color'

interface Position {
  x: number
  y: number
}

interface Size {
  width: number
  height: number
}

const RESIZE_HANDLE_SIZE = 24

export const DashboardBlock: React.FC<{
  children: React.ReactNode
  initialPosition?: Position
  initialSize?: Size
  minWidth?: number
  minHeight?: number
  maxWidth?: number
  maxHeight?: number
  onResize?: (size: Size) => void
  onMove?: (position: Position) => void
}> = ({
  children,
  initialPosition = { x: 50, y: 50 },
  initialSize = { width: 200, height: 300 },
  minWidth = 200,
  minHeight = 300,
  maxWidth = 300,
  maxHeight = 900,
  onResize,
  onMove
}) => {
  const [isLocked, setIsLocked] = useState(false)

  const [isHovered, setIsHovered] = useState(false)
  const [position, setPosition] = useState<Position>(initialPosition)
  const [size, setSize] = useState<Size>(initialSize)
  const [isDragging, setIsDragging] = useState(false)
  const [isResizing, setIsResizing] = useState(false)
  const [resizeDirection, setResizeDirection] = useState<'n' | 's' | 'e' | 'w' | 'ne' | 'nw' | 'se' | 'sw' | null>(null)
  const dragStartRef = useRef<Position>({ x: 0, y: 0 })
  const containerRef = useRef<HTMLDivElement>(null)

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
    if (isLocked) return
    e.preventDefault()
    setIsHovered(true)

    if ((e.target as HTMLElement).classList.contains('resize-handle')) return

    const direction = getResizeDirection(e)
    if (direction) {
      e.preventDefault()
      setIsResizing(true)
      setResizeDirection(direction)
      dragStartRef.current = { x: e.clientX, y: e.clientY }
      return
    }

    setIsDragging(true)
    dragStartRef.current = { x: e.clientX - position.x, y: e.clientY - position.y }
  }

  const handleTouchStart = (e: React.TouchEvent) => {
    if (isLocked) return
    e.preventDefault()
    setIsHovered(true)

    const direction = getResizeDirection(e)
    if (direction) {
      e.preventDefault()
      setIsResizing(true)
      setResizeDirection(direction)
      dragStartRef.current = { x: e.touches[0].clientX, y: e.touches[0].clientY }
      return
    }

    setIsDragging(true)
    dragStartRef.current = { x: e.touches[0].clientX - position.x, y: e.touches[0].clientY - position.y }
  }

  const handleTouchMove = (e: TouchEvent) => {
    if (isLocked) return
    e.preventDefault()
    
    if (isDragging) {
      const newX = e.touches[0].clientX - dragStartRef.current.x
      const newY = e.touches[0].clientY - dragStartRef.current.y
      setPosition({ x: Math.max(0, newX), y: Math.max(0, newY) })
      onMove?.({ x: Math.max(0, newX), y: Math.max(0, newY) })
    } else if (isResizing && resizeDirection) {
      const deltaX = e.touches[0].clientX - dragStartRef.current.x
      const deltaY = e.touches[0].clientY - dragStartRef.current.y
      dragStartRef.current = { x: e.touches[0].clientX, y: e.touches[0].clientY }

      setSize(prevSize => {
        let newWidth = prevSize.width
        let newHeight = prevSize.height
        let newX = position.x
        let newY = position.y

        if (resizeDirection.includes('e')) {
          newWidth = Math.max(minWidth, Math.min(maxWidth, prevSize.width + deltaX))
        }
        if (resizeDirection.includes('w')) {
          const diff = Math.max(minWidth - prevSize.width, deltaX)
          newWidth = Math.max(minWidth, Math.min(maxWidth, prevSize.width - deltaX))
          newX = position.x + diff
        }
        if (resizeDirection.includes('s')) {
          newHeight = Math.max(minHeight, Math.min(maxHeight, prevSize.height + deltaY))
        }
        if (resizeDirection.includes('n')) {
          const diff = Math.max(minHeight - prevSize.height, deltaY)
          newHeight = Math.max(minHeight, Math.min(maxHeight, prevSize.height - deltaY))
          newY = position.y + diff
        }

        setPosition({ x: newX, y: newY })
        onMove?.({ x: newX, y: newY })
        onResize?.({ width: newWidth, height: newHeight })
        return { width: newWidth, height: newHeight }
      })
    }
  }

  const handleMouseUp = () => {
    setIsDragging(false)
    setIsResizing(false)
    setResizeDirection(null)
  }

  const handleTouchEnd = () => {
    setIsDragging(false)
    setIsResizing(false)
    setResizeDirection(null)
  }

  React.useEffect(() => {
    if (isLocked) return

    const handleMouseMove = (e: MouseEvent) => {
      if (isDragging) {
        const newX = e.clientX - dragStartRef.current.x
        const newY = e.clientY - dragStartRef.current.y
        setPosition({ x: Math.max(0, newX), y: Math.max(0, newY) })
        onMove?.({ x: Math.max(0, newX), y: Math.max(0, newY) })
      } else if (isResizing && resizeDirection) {
        const deltaX = e.clientX - dragStartRef.current.x
        const deltaY = e.clientY - dragStartRef.current.y
        dragStartRef.current = { x: e.clientX, y: e.clientY }

        setSize(prevSize => {
          let newWidth = prevSize.width
          let newHeight = prevSize.height
          let newX = position.x
          let newY = position.y

          if (resizeDirection.includes('e')) {
            newWidth = Math.max(minWidth, Math.min(maxWidth, prevSize.width + deltaX))
          }
          if (resizeDirection.includes('w')) {
            const diff = Math.max(minWidth - prevSize.width, deltaX)
            newWidth = Math.max(minWidth, Math.min(maxWidth, prevSize.width - deltaX))
            newX = position.x + diff
          }
          if (resizeDirection.includes('s')) {
            newHeight = Math.max(minHeight, Math.min(maxHeight, prevSize.height + deltaY))
          }
          if (resizeDirection.includes('n')) {
            const diff = Math.max(minHeight - prevSize.height, deltaY)
            newHeight = Math.max(minHeight, Math.min(maxHeight, prevSize.height - deltaY))
            newY = position.y + diff
          }

          setPosition({ x: newX, y: newY })
          onMove?.({ x: newX, y: newY })
          onResize?.({ width: newWidth, height: newHeight })
          return { width: newWidth, height: newHeight }
        })
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
  }, [isDragging, isResizing, handleMouseUp, handleTouchMove, handleTouchEnd])

  const [hoverDirection, setHoverDirection] = useState<'n' | 's' | 'e' | 'w' | 'ne' | 'nw' | 'se' | 'sw' | null>(null)

  const handleMouseEnter = (e: React.MouseEvent) => {
    if (isLocked) return
    e.preventDefault()

    setIsHovered(true)
    const direction = getResizeDirection(e)
    setHoverDirection(direction)
  }

  const handleMouseLeave = () => {
    if (!isDragging && !isResizing) {
      setIsHovered(false)
    }
    setHoverDirection(null)
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
