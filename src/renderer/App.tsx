import React, { useState, useEffect } from 'react'
import './App.scss'
import InstrumentPanel from './instrument/InstrumentPanel'
import Settings from './setting/Settings'
import TitleBar from './components/TitleBar'
import { GLOBAL_COLOR } from './style/color'
import ButtonForMouse from './components/ButtonForMouse'
import { GLOBAL_STYLE } from './style/style'
import { INSTRUMENT_CONST } from '../main/instrument/const/instrumentConst'
import HOTASInput2Axis1 from './overlay/HOTASInput2Axis1'
import HOTASInput3Axis1 from './overlay/HOTASInput3Axis1'
import VirtualAxis from './overlay/VirtualAxis1'

const styles = {
  tab: {
    flex: '1',
    padding: '10px 20px',
    border: 'none',
    backgroundColor: 'transparent',
    cursor: 'pointer',
    fontSize: GLOBAL_STYLE.GLOBAL_FONT_PRIMARY.fontSize,
    transition: 'all 0.2s ease',
  },
}

const App: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'instrument' | 'settings'>('instrument')
  const [route, setRoute] = useState<string>("")
  const [id, setId] = useState<string>("")

  useEffect(() => {
    const checkHash = () => {
      const hash = window.location.hash
      if (hash.includes("#/")) {
        const route = hash.split('/')[1].split('?')[0]
        const argStr = hash.split('?')[1]
        const args = argStr.split("&")
        for (const each of args) {
          if (each.includes("id=")) {
            const idDecoded = each.split("id=")
            console.log("id = " + idDecoded[1])
            setId(idDecoded[1])
            break
          }
        }
        setRoute(route)
      } else {
        setRoute("")
        setId("")
      }
    }
    checkHash()
    window.addEventListener('hashchange', checkHash)
    return () => window.removeEventListener('hashchange', checkHash)
  }, [])

  console.log("route = " + route)
  console.log("id = " + id)
  switch (route) {
    case INSTRUMENT_CONST.HOTAS_INPUT_2_AXIS_1_ROUTE:
      return <HOTASInput2Axis1 overlayId={id} />
    case INSTRUMENT_CONST.HOTAS_INPUT_3_AXIS_1_ROUTE:
      return <HOTASInput3Axis1 overlayId={id} />
    case INSTRUMENT_CONST.VIRTUAL_AXIS_1_ROUTE:
      return <VirtualAxis overlayId={id} />
  }

  return (
    <div style={{
      width: '100vw',
      height: '100vh',
      display: 'flex',
      flexDirection: 'column'
    }}>
      <TitleBar />
      <div
        style={{
          display: 'flex',
          backgroundColor: GLOBAL_COLOR.BACKGROUND,
          borderBottom: `1px solid ${GLOBAL_COLOR.MINIMUM}`,
        }}>
        <ButtonForMouse
          style={{
            ...styles.tab,
            color: GLOBAL_COLOR.PRIMARY,
            borderBottom: `3px solid ${GLOBAL_COLOR.TRANSPARENT}`
          }}
          styleHover={{
            backgroundColor: GLOBAL_COLOR.BRAND_LITE,
          }}
          styleOn={{
            borderBottom: `3px solid ${GLOBAL_COLOR.BRAND}`
          }}
          pIsOn={activeTab === 'instrument'}
          onClick={() => setActiveTab('instrument')}
        >
          Instrument Panel
        </ButtonForMouse>
        <ButtonForMouse
          style={{
            ...styles.tab,
            color: GLOBAL_COLOR.PRIMARY,
            borderBottom: `3px solid ${GLOBAL_COLOR.TRANSPARENT}`
          }}
          styleHover={{
            backgroundColor: GLOBAL_COLOR.BRAND_LITE,
          }}
          styleOn={{
            borderBottom: `3px solid ${GLOBAL_COLOR.BRAND}`
          }}
          pIsOn={activeTab === 'settings'}
          onClick={() => setActiveTab('settings')}
        >
          Settings
        </ButtonForMouse>
      </div>
      <div 
        style={{
          height: '100%',
          overflowY: 'auto'
        }}
      >
        {activeTab === 'instrument' && <InstrumentPanel />}
        {activeTab === 'settings' && <Settings />}
      </div>
    </div>
  )
}

export default App