import { GLOBAL_STYLE } from "../../../../style/style"
import { SKMRPH1_STYLES } from "./Styles"

export const getSkmrphSlider1V = (
  isTooLow:boolean,
  normalizedValue: number,
  axisValue: number,
  setAxisValue: React.Dispatch<React.SetStateAction<number>>,) => {
  return (
    <SkmrphSlider1V
      isTooLow={isTooLow}
      normalizedValue={normalizedValue}
      axisValue={axisValue}
      setAxisValue={setAxisValue}
    />
  )
}
export const SkmrphSlider1V: React.FC<{
  isTooLow:boolean,
  normalizedValue: number,
  axisValue: number,
  setAxisValue: React.Dispatch<React.SetStateAction<number>>,
}> = ({
  isTooLow,
  normalizedValue,
  axisValue,
  setAxisValue
}) => {
  return (
    <div style={{
      width: '100%',
      height: '100%',
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'center',
      alignItems: 'center',
      gap: '40px',
      background: 'transparent',
      boxSizing: 'border-box'
    }}>
      <div style={{
        background: SKMRPH1_STYLES.frameBackground,
        borderRadius: '24px',
        padding: '32px 28px',
        boxShadow: SKMRPH1_STYLES.frameShadow,
        position: 'relative',
        height: "100%",
        width: '100%',
        boxSizing: 'border-box'
      }}>
        <div style={{
          position: "absolute",
          top: "16px",
          left: "16px",
          width: '10px',
          height: '10px',
          borderRadius: '50%',
          background: isTooLow
            ? SKMRPH1_STYLES.indicatorLowBackground
            : SKMRPH1_STYLES.indicatorBackground,
          boxShadow: isTooLow
            ? SKMRPH1_STYLES.indicatorLowShadow
            : SKMRPH1_STYLES.indicatorShadow,
          transition: 'all 0.15s ease'
        }} />
        <div style={{
          height: "100%",
          background: SKMRPH1_STYLES.controlShadeBackground,
          borderRadius: '16px',
          padding: '24px',
          boxShadow: SKMRPH1_STYLES.controlShadeShadow,
          position: 'relative',
        }}>
          <div style={{
            position: 'absolute',
            top: '16px',
            left: '8px',
            bottom: '16px',
            width: '40px',
            background: SKMRPH1_STYLES.controlGlowBackground,
            borderRadius: '8px 0 0 8px'
          }} />
          <div style={{
            position: 'absolute',
            height: "100%",
            top: '0px',
            left: "16px",
            padding: "24px 0px",
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between',
            alignItems: 'center',
          }}>
            {[-1, -0.5, 0, 0.5, 1].map((mark) => (
              <div key={mark} style={{
                display: 'flex',
                flexDirection: 'row',
                alignItems: 'center',
                gap: '4px'
              }}>
                <div style={{
                  height: '2px',
                  width: mark === 0 ? '16px' : '8px',
                  background: mark === 0 ? SKMRPH1_STYLES.markCenterBackground : SKMRPH1_STYLES.markBackground,
                  borderRadius: '1px',
                  boxShadow: mark === 0 ? SKMRPH1_STYLES.marckCenterShadow : SKMRPH1_STYLES.markShadow
                }} />
              </div>
            ))}
          </div>

          <div style={{
            position: 'relative',
            width: '100%',
            height: '100%',
            display: 'flex',
            alignItems: 'center',
          }}>
            <div style={{
              position: 'absolute',
              top: '0',
              bottom: '0',
              width: '12px',
              left: 'calc(50%)',
              transform: 'translateX(-50%)',
              borderRadius: '6px',
              boxShadow: SKMRPH1_STYLES.trackShadow,
            }} />

            <div style={{
              position: 'absolute',
              bottom: '0',
              height: `${normalizedValue * 100}%`,
              width: '12px',
              left: 'calc(50%)',
              transform: 'translateX(-50%)',
              background: isTooLow
                ? SKMRPH1_STYLES.progressBackgroundLow
                : SKMRPH1_STYLES.progressBackground,
              boxShadow: isTooLow
                ? SKMRPH1_STYLES.progressLowShadow
                : SKMRPH1_STYLES.progressShadow,
              borderRadius: '0 0 6px 6px',
            }} />

            <div
              style={{
                position: 'absolute',
                top: `calc(${(1 - normalizedValue) * 100}% - 20px)`,
                left: `calc(50% - ${SKMRPH1_STYLES.knobWidth} / 2)`,
                width: SKMRPH1_STYLES.knobWidth,
                height: '40px',
                background: SKMRPH1_STYLES.knobBackground,
                borderRadius: '8px',
                border: SKMRPH1_STYLES.knobBorder,
                boxShadow: SKMRPH1_STYLES.knobShadow,
                cursor: 'pointer',
                zIndex: 10
              }}
              onMouseDown={(e) => {
                const track = e.currentTarget.parentElement
                if (!track) return
                const rect = track.getBoundingClientRect()
                const handleMouseMove = (e: MouseEvent) => {
                  const y = Math.max(0, Math.min(e.clientY - rect.top, rect.height))
                  const newValue = 1 - (y / rect.height) * 2
                  setAxisValue(Math.round(newValue * 100) / 100)
                }
                const handleMouseUp = () => {
                  document.removeEventListener('mousemove', handleMouseMove)
                  document.removeEventListener('mouseup', handleMouseUp)
                }
                document.addEventListener('mousemove', handleMouseMove)
                document.addEventListener('mouseup', handleMouseUp)
              }}
            >
            </div>
          </div>

          <div style={{
            position: 'absolute',
            right: '8px',
            top: '16px',
            bottom: '16px',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between',
            alignItems: 'center'
          }}>
            <div style={{
              fontFamily: '"Consolas", "Monaco", monospace',
              fontSize: GLOBAL_STYLE.GLOBAL_FONT_PRIMARY.fontSize,
              color: SKMRPH1_STYLES.textMarkingColor,
              letterSpacing: '1px'
            }}>MAX</div>
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: '8px'
            }}>
            </div>
            <div style={{
              fontFamily: '"Consolas", "Monaco", monospace',
              fontSize: GLOBAL_STYLE.GLOBAL_FONT_PRIMARY.fontSize,
              color: '#3a4a5a',
              letterSpacing: '1px'
            }}>MIN</div>
          </div>
        </div>
        <input
          type="range"
          min="-1"
          max="1"
          step="0.01"
          value={axisValue}
          onChange={(e) => setAxisValue(parseFloat(e.target.value))}
          style={{
            position: 'absolute',
            width: '1px',
            height: '1px',
            opacity: 0,
            pointerEvents: 'none'
          }}
        />
      </div>
    </div>
  )
}