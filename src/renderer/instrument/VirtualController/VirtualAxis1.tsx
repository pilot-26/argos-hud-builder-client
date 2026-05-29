import React, { useEffect, useState } from 'react'
import { VIRTUAL_CONST } from '../../../main/virtual/virtualConst'
import { EVCommandType, EVControlType, IVCommandMessage } from '../../../main/virtual/types'

const VirtualAxis1: React.FC<{args: any}> = ({args}) => {
  const [axisId] = useState<string>(args.controlId0)
  const [axisValue, setAxisValue] = useState<number>(0)

  const initController = async () => {
    try {
      await window.virtualAPI.connect("127.0.0.1", VIRTUAL_CONST.DEFAULT_PORT)
      const message: IVCommandMessage = {
        VCommandType: EVCommandType.REGISTER,
        VControlId: axisId,
        VControlType: EVControlType.AXIS
      }
      await window.virtualAPI.send(JSON.stringify(message) + "#")
    } catch (error) {
      console.error('Failed to create virtual controller:', error)
    }
  }

  useEffect(() => {
    initController()
  }, [])

  const sendInput = async () => {
    try {
      const message: IVCommandMessage = {
        VCommandType: EVCommandType.SEND_INPUT,
        VControlId: axisId,
        VControlType: EVControlType.AXIS,
        axisValue: axisValue
      }
      await window.virtualAPI.send(JSON.stringify(message) + "#")
    } catch (error) {
      console.error('Failed to send input:', error)
    }
  }

  useEffect(() => {
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
        <input
          type="range"
          min="-1"
          max="1"
          step="0.01"
          value={axisValue}
          onChange={(e) => setAxisValue(parseFloat(e.target.value))}
          style={{ width: '100%' }}
        />
        { "Goodbyte" + axisId }
      </div>
    </div>
  )
}

export default VirtualAxis1
