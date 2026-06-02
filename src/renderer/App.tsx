import React, { useState, useEffect } from 'react'
import './App.scss'
import SettingsTab from './tabs/SettingsTab'
import TitleBar from './components/TitleBar'
import { GLOBAL_COLOR } from './style/color'
import ButtonForMouse from './components/ButtonForMouse'
import { GLOBAL_STYLE } from './style/style'
import GenericOverlay from './overlay/GenericOverlay'
import { INSTRUMENT_CONST } from './instrument/const'
import HUDTab from './tabs/HUDTab'
import DashboardTab from './tabs/DashboardTab'

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
  const [activeTab, setActiveTab] = useState<'dashboard' | 'hud' | 'settings'>('dashboard')
  const [route, setRoute] = useState<string>("")
  const [ParamObject, setParamObject] = useState<any>({})

  useEffect(() => {
    const checkHash = () => {
      const hash = window.location.hash
      console.log("hash = " + hash)
      if (hash.includes("#/")) {
        const route = hash.split('/')[1].split('?')[0]
        const paramStr = hash.split('?')[1]
        const paramList = paramStr ? paramStr.split("&") : []
        const newParamObject: any = {}
        for (const each of paramList) {
          const split = each.split("=")
          newParamObject[split[0]] = split[1]
        }
        setParamObject(newParamObject)
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
  console.log("args = " + JSON.stringify(ParamObject))
  switch (route) {
    case INSTRUMENT_CONST.INSTRUMENT_ROUTE:
      const getInstrumentComponent = (templateId: string) => {
        for (const each of INSTRUMENT_CONST.INSTRUMENT_TEMPLATE_PRESET) {
          if (templateId === each.id) {
            return each.instrumentComponent.getLogicElement({
              params: {...ParamObject, isActive: true},
              getUIElement: each.instrumentComponent.getUIElement
            })
          }
        }
      }
      return (
        <GenericOverlay
          overlayId={ParamObject.id}
        >
          {getInstrumentComponent(ParamObject.templateId)}
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
          pIsOn={activeTab === 'dashboard'}
          onClick={() => setActiveTab('dashboard')}
        >
          Dashboard
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
          pIsOn={activeTab === 'hud'}
          onClick={() => setActiveTab('hud')}
        >
          HUD
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
        flex: 1,
        position: 'relative',
        overflow: 'hidden'
        }}
      >
        {activeTab === 'dashboard' && <DashboardTab />}
        {activeTab === 'hud' && <HUDTab />}
        {activeTab === 'settings' && <SettingsTab />}
      </div>
    </div>
  )
}

export default App