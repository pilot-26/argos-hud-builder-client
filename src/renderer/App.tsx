import React, { useState, useEffect } from 'react'
import './App.scss'
import SettingsTab from './tabs/SettingsTab'
import TitleBar from './components/TitleBar'
import { GLOBAL_COLOR } from './style/color'
import ButtonForMouse from './components/ButtonForMouse'
import { GLOBAL_STYLE } from './style/style'
import { PanelComponent } from './panel/PanelComponent'
import { PanelTab } from './tabs/PanelTab'
import { PANEL_CONST } from './panel/const'
import { PanelEditComponent } from './panel/PanelEditComponent'

const styles = {
  tab: {
    flex: '1',
    padding: '10px 20px',
    border: 'none',
    background: 'transparent',
    cursor: 'pointer',
    fontSize: GLOBAL_STYLE.GLOBAL_TEXT_PRIMARY.fontSize,
    transition: 'all 0.2s ease',
  },
}

const App: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'home' | 'settings'>('home')
  const [route, setRoute] = useState<string>("")
  const [paramObject, setParamObject] = useState<any>({})

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
  console.log("args = " + JSON.stringify(paramObject))
  switch (route) {
    case PANEL_CONST.PANEL_ROUTE:
      return (
        (paramObject.isEditMode) ? (
          <PanelEditComponent overlayId={paramObject.overlayId}  panelId={paramObject.panelId} />
        ) : (
          <PanelComponent overlayId={paramObject.overlayId} panelId={paramObject.panelId} />
        )
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
          background: GLOBAL_COLOR.BACKGROUND,
          borderBottom: `1px solid ${GLOBAL_COLOR.MINIMUM}`,
        }}>
        <ButtonForMouse
          style={{
            ...styles.tab,
            color: GLOBAL_COLOR.PRIMARY,
            borderBottom: `3px solid ${GLOBAL_COLOR.TRANSPARENT}`
          }}
          styleHover={{
            background: GLOBAL_COLOR.BRAND_LITE,
          }}
          styleOn={{
            borderBottom: `3px solid ${GLOBAL_COLOR.BRAND}`
          }}
          pIsOn={activeTab === 'home'}
          onClick={() => setActiveTab('home')}
        >
          Home
        </ButtonForMouse>
        <ButtonForMouse
          style={{
            ...styles.tab,
            color: GLOBAL_COLOR.PRIMARY,
            borderBottom: `3px solid ${GLOBAL_COLOR.TRANSPARENT}`
          }}
          styleHover={{
            background: GLOBAL_COLOR.BRAND_LITE,
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
      {activeTab === 'home' && <PanelTab />}
      {activeTab === 'settings' && <SettingsTab />}
    </div>
  )
}

export default App