import React, { useEffect } from 'react'
import { GLOBAL_STYLE } from '../style/style'
import { GLOBAL_COLOR } from '../style/color'
import ModalTitleBar from '../components/ModalTitleBar'
import ButtonForMouse from '../components/ButtonForMouse'
import { IInstrumentTemplate, } from '../instrument/types'
import { INSTRUMENT_CONST } from '../instrument/const'
import { DashboardStorage } from '../dashboard/util/dashboardStorage'
import { Dashboard } from '../dashboard/data/dashboard'
import { DashboardOption } from '../dashboard/data/dashboardOption'
import DashboardBlock from '../dashboard/DashboardBlock'
import { F14Dash } from '../dashboard/background/F14Dash'

const DashboardTab: React.FC = () => {
  const [showBackgroundModal, setBackgroundModal] = React.useState(false)
  const [showAddModal, setShowAddModal] = React.useState(false)
  const [isLocked, setIsLocked] = React.useState(false)
  const [selectedInstrumentList, setSelectedInstrumentList] = React.useState<Dashboard[]>([])

  const loadInstrument = async () => {
    const saved = await DashboardStorage.list()
    for (const item of saved) {
      if (item.embedded.isLocked) {
        setIsLocked(true)
        break
      }
    }
    setSelectedInstrumentList(saved)
  }

  const handleInstrumentDelete = async (id: string) => {
    await DashboardStorage.remove(id)
    loadInstrument()
  }

  const handleInstrumentAdd = async (item: IInstrumentTemplate) => {
    const newInstrumentOption = await new DashboardOption(item).create()
    const newInstrument = new Dashboard(newInstrumentOption)
    await newInstrument.build()
    
    loadInstrument()
    
    setShowAddModal(false)
  }

  useEffect(() => {
    loadInstrument()
  }, [showAddModal])

  const handleLock = () => {
    setIsLocked(true)
    for (const item of selectedInstrumentList) {
      item.embedded.isLocked = true
      item.save()
    }
    setSelectedInstrumentList(selectedInstrumentList)
  }
  const handleUnlock = () => {
    setIsLocked(false)
    for (const item of selectedInstrumentList) {
      item.embedded.isLocked = false
      item.save()
    }
    setSelectedInstrumentList(selectedInstrumentList)
  }
  const handleBackground = () => {

  }

  const handleAdd = () => {
    setShowAddModal(true)
  }

  return (
    <div>
      {selectedInstrumentList.map((item) => (
        <DashboardBlock
          key={item.id}
          item={item}
          onDelete={handleInstrumentDelete}
        />
      ))}
      <F14Dash />
      <div
        style={{
          position: 'absolute',
          bottom: `${GLOBAL_STYLE.GLOBAL_PADDING_LARGE}`,
          right: `${GLOBAL_STYLE.GLOBAL_PADDING_LARGE}`,
          display: 'flex',
          flexDirection: 'row',
          alignItems: 'center',
          gap: '8px'
        }}
      >
        <ButtonForMouse
          style={{
            ...GLOBAL_STYLE.GLOBAL_BUTTON_TEXT_POSITIVE,
          }}
          styleHover={{
            backgroundColor: GLOBAL_COLOR.BRAND_LITE,  
          }}
          onClick={handleUnlock}
        >
          Background
        </ButtonForMouse>
        {isLocked ? (
          <ButtonForMouse
            style={{
              ...GLOBAL_STYLE.GLOBAL_BUTTON_TEXT_POSITIVE,
            }}
            styleHover={{
              backgroundColor: GLOBAL_COLOR.BRAND_LITE,  
            }}
            onClick={handleUnlock}
          >
            Unlock
          </ButtonForMouse>
        ) : (
          <ButtonForMouse
            style={{
              ...GLOBAL_STYLE.GLOBAL_BUTTON_TEXT_POSITIVE,
            }}
            styleHover={{
              backgroundColor: GLOBAL_COLOR.BRAND_LITE,  
            }}
            onClick={handleLock}
          >
            Lock
          </ButtonForMouse>
        )}
        <ButtonForMouse
          style={{
            ...GLOBAL_STYLE.GLOBAL_BUTTON_TEXT_POSITIVE,
          }}
          styleHover={{
            backgroundColor: GLOBAL_COLOR.BRAND_LITE,  
          }}
          onClick={handleAdd}
        >
          Add
        </ButtonForMouse>
      </div>
      {showAddModal && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
          backgroundColor: GLOBAL_COLOR.TRANSPARENT,
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          zIndex: 1000
        }}>
          <div style={{
            backgroundColor: 'white',
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
                {INSTRUMENT_CONST.INSTRUMENT_TEMPLATE_PRESET.map((item) => (
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
                      backgroundColor: GLOBAL_COLOR.MINIMUM,
                    }}
                    onClick={(e: React.MouseEvent) => {
                      e.stopPropagation()
                      handleInstrumentAdd(item)
                    }}
                  >
                    <div style={{flex: 1, display: 'flex', justifyContent: 'center', alignItems: 'center', overflow: 'hidden', transform: 'scale(0.5)' }}>
                      {item.instrumentComponent.getUIElement()}
                    </div>
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

export default DashboardTab
