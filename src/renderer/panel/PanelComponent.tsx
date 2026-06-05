import React, { useEffect } from 'react'
import { Panel } from './data/panel'
import { Avionics } from '../avionics/data/avionics'
import AvionicsBlock from '../avionics/AvionicsBlock'
import { OverlayLowProfile } from '../overlay/OverlayLowProfile'

export const PanelComponent: React.FC<{
  overlayId: string,
  panelId: string
}> = ({
  overlayId,
  panelId
}) => {
  const [selectedAvionicsList, setSelectedAvionicsList] = React.useState<Avionics[]>([])

  useEffect(() => {
    const loadPanel = async () => {
      const panelFromStorage = await Panel.getFromId(panelId)
      if (!panelFromStorage) return
      await panelFromStorage.build()
      setSelectedAvionicsList(panelFromStorage.avionicsList)
      console.log("selectedAvionicsList = " + JSON.stringify(selectedAvionicsList))
    }
    loadPanel()
  }, [])

  return (
    <OverlayLowProfile
      overlayId={overlayId}
    >
      <div
        style={{
          flex: 1,
          width: '100%',
          height: '100%',
          position: 'relative',
          overflow: 'hidden',
        }}
      >
        {selectedAvionicsList.map((item) => (
          <AvionicsBlock
            key={item.id}
            isLocked={true}
            item={item}
          />
        ))}
      </div>
    </OverlayLowProfile>
  )
}