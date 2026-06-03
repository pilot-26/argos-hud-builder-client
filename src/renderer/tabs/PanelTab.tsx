import React, { useEffect } from 'react'
import { GLOBAL_STYLE } from '../style/style'
import { GLOBAL_COLOR } from '../style/color'
import ModalTitleBar from '../components/ModalTitleBar'
import ButtonForMouse from '../components/ButtonForMouse'
import { PanelStorage } from '../panel/util/panelStorage'
import { IPanelTemplate } from '../panel/types'
import { PanelOption } from '../panel/data/panelOption'
import { Panel } from '../panel/data/panel'
import { PanelBlock } from '../panel/PanelBlock'
import { PANEL_CONST } from '../panel/const'

export const PanelTab: React.FC = () => {
  const [showAddModal, setShowAddModal] = React.useState(false)
  const [selectedPanelList, setSelectedPanelList] = React.useState<Panel[]>([])

  const loadPanel = async () => {
    const saved = await PanelStorage.list()
    setSelectedPanelList(saved)
  }

  const handlePanelDelete = async (id: string) => {
    await PanelStorage.remove(id)
    loadPanel()
  }

  const handlePanelAdd = async (item: IPanelTemplate) => {
    const userParam = {name: "1"}
    const newPanelOption = await new PanelOption(item, userParam).create()
    const newPanel = new Panel(newPanelOption)
    await newPanel.sync()
    
    loadPanel()
    
    setShowAddModal(false)
  }

  useEffect(() => {
    loadPanel()
  }, [showAddModal])

  const handleAdd = () => {
    setShowAddModal(true)
  }

  return (
    <div style={{
      padding: GLOBAL_STYLE.GLOBAL_PADDING,
      display: "flex",
      flexDirection: "column",
      gap: GLOBAL_STYLE.GLOBAL_GAP,
      flex: 1,
      position: 'relative',
      overflow: 'auto'
    }}>
      <div style={{
        marginBottom: GLOBAL_STYLE.GLOBAL_PADDING,
        display: "grid",
        gridTemplateColumns: "repeat(3, 1fr)",
        gridGap: GLOBAL_STYLE.GLOBAL_GAP,
        gap: GLOBAL_STYLE.GLOBAL_GAP,
      }}>
        {selectedPanelList.map((item) => (
          <PanelBlock
            key={item.id}
            item={item}
            onDelete={handlePanelDelete}
          />
        ))}
      </div>
      <ButtonForMouse
        style={{
          ...GLOBAL_STYLE.GLOBAL_BUTTON_TEXT_POSITIVE,
        }}
        styleHover={{
          background: GLOBAL_COLOR.BRAND_LITE,  
        }}
        onClick={handleAdd}
      >
        Add
      </ButtonForMouse>
      {showAddModal && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
          background: GLOBAL_COLOR.TRANSPARENT,
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          zIndex: 1000
        }}>
          <div style={{
            background: 'white',
            borderRadius: GLOBAL_STYLE.GLOBAL_BORDER_RADIUS,
            width: '80%',
            height: '80%',
            overflow: 'auto',
            boxShadow: '0px 0px 10px 0px rgba(0, 0, 0, 0.1)',
          }}>
            <ModalTitleBar onClose={() => setShowAddModal(false)} />
            <div style={{
              padding: GLOBAL_STYLE.GLOBAL_PADDING,
            }}>
              <div style={{
                marginBottom: GLOBAL_STYLE.GLOBAL_PADDING,
                display: "grid",
                gridTemplateColumns: "repeat(3, 1fr)",
                gridGap: "10px",
                gap: GLOBAL_STYLE.GLOBAL_PADDING,
              }}>
                {PANEL_CONST.PANEL_TEMPLATE_PRESET.map((item) => (
                  <ButtonForMouse
                    key={item.name}
                    style={{
                      position: "relative",
                      border: "none",
                      borderRadius: GLOBAL_STYLE.GLOBAL_BORDER_RADIUS_SMALL,
                      padding: GLOBAL_STYLE.GLOBAL_PADDING,
                      display: 'flex',
                      flexDirection: 'column',
                      justifyContent: 'center',
                      alignItems: 'center',
                      width: '100%',
                      aspectRatio: '1 / 1',
                      overflow: 'hidden',
                    }}
                    styleHover={{
                      background: GLOBAL_COLOR.MINIMUM,
                    }}
                    onClick={(e: React.MouseEvent) => {
                      e.stopPropagation()
                      handlePanelAdd(item)
                    }}
                  >
                    <div style={GLOBAL_STYLE.GLOBAL_FONT_SECONDARY}>{item.name}</div>
                  </ButtonForMouse>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}