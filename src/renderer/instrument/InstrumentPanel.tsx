import React, { useEffect, useState } from 'react'
import { GLOBAL_STYLE } from '../style/style'
import { GLOBAL_COLOR } from '../style/color'
import ModalTitleBar from '../components/ModalTitleBar'
import ButtonForMouse from '../components/ButtonForMouse'
import { IInstrumentTemplate, EInstrumentType, IControl } from './data/types'
import { INSTRUMENT_CONST } from './const/instrumentConst'
import InstrumentButton from './InstrumentButton'
import { InstrumentStorage } from './util/instrumentStorage'
import { Instrument } from './data/instrument'
import { InstrumentOption } from './data/instrumentOption'
import { OverlayStorage } from '../overlay/util/overlayStorage'
import { Overlay } from '../overlay/data/overlay'

const InstrumentPanel: React.FC = () => {
  const [showAddModal, setShowAddModal] = React.useState(false)
  const [selectedInstrumentList, setSelectedInstrumentList] = React.useState<Instrument[]>([])

  const loadInstrument = async () => {
    const saved = await InstrumentStorage.list()
    setSelectedInstrumentList(saved)
  }

  const handleInstrumentDelete = async (id: string) => {
    await InstrumentStorage.remove(id)
    loadInstrument()
  }

  const handleInstrumentAdd = async (item: IInstrumentTemplate) => {
    const newInstrumentOption = new InstrumentOption(item).build()
    const newOverlay = new Overlay(newInstrumentOption.overlayOption)
    OverlayStorage.set(newOverlay)
    
    const newInstrument = new Instrument(newInstrumentOption)
    await newInstrument.build()
    InstrumentStorage.set(newInstrument)

    setShowAddModal(false)
  }

  useEffect(() => {
    loadInstrument()
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
    }}>
      <div style={{
        marginBottom: GLOBAL_STYLE.GLOBAL_PADDING,
        display: "grid",
        gridTemplateColumns: "repeat(3, 1fr)",
        gridGap: GLOBAL_STYLE.GLOBAL_GAP,
        gap: GLOBAL_STYLE.GLOBAL_GAP,
      }}>
        {selectedInstrumentList.map((item) => (
          <InstrumentButton
            key={item.id}
            item={item}
            onDelete={handleInstrumentDelete}
          />
        ))}
      </div>
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
                gridTemplateColumns: "repeat(2, 1fr)",
                gridGap: "10px",
                gap: GLOBAL_STYLE.GLOBAL_PADDING,
              }}>
                {INSTRUMENT_CONST.INSTRUMENT_TEMPLATE_PRESET.map((item) => (
                  <ButtonForMouse
                    key={item.name}
                    style={{
                      border: "none",
                      borderRadius: GLOBAL_STYLE.GLOBAL_BORDER_RADIUS_SMALL,
                      padding: GLOBAL_STYLE.GLOBAL_PADDING_SMALL,
                      height: '50vh',
                    }}
                    styleHover={{
                      backgroundColor: GLOBAL_COLOR.MINIMUM,
                    }}
                    onClick={() => handleInstrumentAdd(item)}
                  >
                    {item.name}
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

export default InstrumentPanel
