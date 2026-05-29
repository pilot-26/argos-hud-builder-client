import React, { useState, useEffect } from 'react'
import { AiOutlineClose, AiOutlineExpand, AiOutlineMinus } from "react-icons/ai"
import { TitleBarStyle } from "./TitleBarStyle"
import { BsJoystick } from "react-icons/bs"

const TitleBar: React.FC = () => {
  const [isMaximized, setIsMaximized] = useState(false)
  const [hoveredButton, setHoveredButton] = useState<string | null>(null)

  useEffect(() => {
    const checkMaximized = async () => {
      const maximized = await window.main.isWindowMaximized()
      setIsMaximized(maximized)
    }
    checkMaximized()
  }, [])

  const handleMinimize = async () => {
    await window.main.minimizeWindow()
  }

  const handleMaximize = async () => {
    await window.main.maximizeWindow()
    setIsMaximized(!isMaximized)
  }

  const handleClose = async () => {
    await window.main.closeWindow()
  }

  return (
    <div style={TitleBarStyle.titleBarStyle} className="draggable-region">
      <div style={TitleBarStyle.titleBarDragRegionStyle}>
        <div style={TitleBarStyle.titleBarIconStyle}>
          <BsJoystick />
        </div>
        <span style={TitleBarStyle.titleBarTitleStyle}>ARGOS HUD Builder</span>
      </div>
      <div style={TitleBarStyle.titleBarControlsStyle} className="no-drag-region">
        <button
          style={{
            ...TitleBarStyle.titleBarButtonStyle,
            ...(hoveredButton === 'minimize' ? TitleBarStyle.titleBarButtonHoverStyle : {})
          }}
          onClick={handleMinimize}
          onMouseEnter={() => setHoveredButton('minimize')}
          onMouseLeave={() => setHoveredButton(null)}
        >
          <AiOutlineMinus />
        </button>
        <button
          style={{
            ...TitleBarStyle.titleBarButtonStyle,
            ...(hoveredButton === 'maximize' ? TitleBarStyle.titleBarButtonHoverStyle : {})
          }}
          onClick={handleMaximize}
          onMouseEnter={() => setHoveredButton('maximize')}
          onMouseLeave={() => setHoveredButton(null)}
        >
          <AiOutlineExpand />
        </button>
        <button
          style={{
            ...TitleBarStyle.titleBarButtonStyle,
            ...(hoveredButton === 'close' ? TitleBarStyle.closeButtonHoverStyle : {})
          }}
          onClick={handleClose}
          onMouseEnter={() => setHoveredButton('close')}
          onMouseLeave={() => setHoveredButton(null)}
        >
          <AiOutlineClose />
        </button>
      </div>
    </div>
  )
}

export default TitleBar