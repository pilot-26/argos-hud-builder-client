import React, { useEffect, useState } from 'react'
import GenericOverlay from './GenericOverlay'
import { IControllerInput } from '../../main/virtual/types'

const VirtualAxis: React.FC<{ overlayId: string }> = ({ overlayId }) => {
  const [leftX, setLeftX] = useState(0)
  const [leftY, setLeftY] = useState(0)

  useEffect(() => {
    const initController = async () => {
      try {

      } catch (error) {
        console.error('Failed to create virtual controller:', error)
      }
    }
    initController()
  }, [])

  useEffect(() => {
    const sendInput = async () => {
      try {
        const input: IControllerInput = {
          leftX: leftX,
          leftY: leftY,
          rightX: leftX,
          rightY: leftY,
          leftTrigger: 0,
          rightTrigger: 0,
          leftBumper: false,
          rightBumper: false,
          leftStick: false,
          rightStick: false,
          buttonX: true,
          buttonY: true,
          buttonA: false,
          buttonB: false,
          buttonStart: false,
          buttonBack: false
        }
        
      } catch (error) {
        console.error('Failed to send input:', error)
      }
    }
    sendInput()
  }, [leftX, leftY, overlayId])

  return (
    <GenericOverlay overlayId={overlayId}>
      <div
        style={{
          width: '100vw',
          height: '100vh',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          alignItems: 'center',
          gap: '40px',
          backgroundColor: 'rgba(0, 0, 0, 0.7)',
          padding: '20px'
        }}
      >
        <div style={{ width: '400px' }}>
          <h3 style={{ color: 'white', marginBottom: '10px' }}>Left X Axis: {leftX.toFixed(2)}</h3>
          <input
            type="range"
            min="-1"
            max="1"
            step="0.01"
            value={leftX}
            onChange={(e) => setLeftX(parseFloat(e.target.value))}
            style={{ width: '100%' }}
          />
        </div>
        <div style={{ width: '400px' }}>
          <h3 style={{ color: 'white', marginBottom: '10px' }}>Left Y Axis: {leftY.toFixed(2)}</h3>
          <input
            type="range"
            min="-1"
            max="1"
            step="0.01"
            value={leftY}
            onChange={(e) => setLeftY(parseFloat(e.target.value))}
            style={{ width: '100%' }}
          />
        </div>
      </div>
    </GenericOverlay>
  )
}

export default VirtualAxis
