import React, { useEffect, useState } from 'react'

const VirtualAxis1: React.FC = () => {
  const [axisValue, setAxisValue] = useState<number>()

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
        
      } catch (error) {
        console.error('Failed to send input:', error)
      }
    }
    sendInput()
  }, [axisValue])

  return (
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
        <h3 style={{ color: 'white', marginBottom: '10px' }}>Axis Value: {axisValue?.toFixed(2)}</h3>
        <input
          type="range"
          min="-1"
          max="1"
          step="0.01"
          value={axisValue}
          onChange={(e) => setAxisValue(parseFloat(e.target.value))}
          style={{ width: '100%' }}
        />
      </div>
    </div>
  )
}

export default VirtualAxis1
