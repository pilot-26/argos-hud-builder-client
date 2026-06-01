import React, { useState, useEffect } from 'react'
import './App.scss'
import InstrumentPanel from './instrument/InstrumentPanel'
import Settings from './setting/Settings'
import TitleBar from './components/TitleBar'
import { GLOBAL_COLOR } from './style/color'
import ButtonForMouse from './components/ButtonForMouse'
import { GLOBAL_STYLE } from './style/style'
import { INSTRUMENT_CONST } from './instrument/const/instrumentConst'
import GenericOverlay from './overlay/GenericOverlay'

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
  const [argsObject, setArgsObject] = useState<any>({})

  useEffect(() => {
    const checkHash = () => {
      const hash = window.location.hash
      console.log("hash = " + hash)
      if (hash.includes("#/")) {
        const route = hash.split('/')[1].split('?')[0]
        const argStr = hash.split('?')[1]
        const args = argStr ? argStr.split("&") : []
        const newArgsObject: any = {}
        for (const each of args) {
          const split = each.split("=")
          newArgsObject[split[0]] = split[1]
        }
        setArgsObject(newArgsObject)
        setRoute(route)
      } else {
        setRoute("")
      }
    }
    checkHash()
    window.addEventListener('hashchange', checkHash)
    return () => window.removeEventListener('hashchange', checkHash)
  }, [])

  console.log("route = " + route)
  console.log("args = " + JSON.stringify(argsObject))
  switch (route) {
    case INSTRUMENT_CONST.INSTRUMENT_ROUTE:
      const getInstrumentComponent = (templateId: string) => {
        for (const each of INSTRUMENT_CONST.INSTRUMENT_TEMPLATE_PRESET) {
          if (templateId === each.id) {
            return each.instrumentUI.getLogicElement({
              args: argsObject,
              getUIElement: each.instrumentUI.param.getUIElement
            })
          }
        }
      }
      return (
        <GenericOverlay
          overlayId={argsObject.id}
        >
          {getInstrumentComponent(argsObject.templateId)}
        </GenericOverlay>
      )
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