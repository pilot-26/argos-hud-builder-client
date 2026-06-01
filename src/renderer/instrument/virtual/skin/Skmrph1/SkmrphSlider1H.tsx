import { GLOBAL_STYLE } from "../../../../style/style"
import { SKMRPH1_STYLES } from "./Styles"

export const getSkmrphSlider1H = (
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
      width: '100vw',
      height: '100vh',
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'center',
      alignItems: 'center',
      gap: '40px',
      background: 'transparent',
      padding: '20px',
      boxSizing: 'border-box'
    }}>
      <div style={{
        background: SKMRPH1_STYLES.frameBackground,
        borderRadius: '24px',
        padding: '28px 32px',
        boxShadow: SKMRPH1_STYLES.frameShadow,
        position: 'relative'
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
          width: '70vw',
          height: '160px',
          background: SKMRPH1_STYLES.controlShadeBackground,
          borderRadius: '16px',
          padding: '24px',
          boxShadow: SKMRPH1_STYLES.controlShadeShadow,
          position: 'relative',
          overflow: 'hidden'
        }}>
          <div style={{
            position: 'absolute',
            top: '8px',
            left: '16px',
            right: '16px',
            height: '40px',
            background: SKMRPH1_STYLES.controlGlowBackground,
            borderRadius: '8px 8px 0 0'
          }} />
          <div style={{
            position: 'absolute',
            width: "100%",
            top: '16px',
            left: "0px",
            padding: "0px 24px",
            display: 'flex',
            justifyContent: 'space-between',
          }}>
            {[-1, -0.5, 0, 0.5, 1].map((mark) => (
              <div key={mark} style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                gap: '4px'
              }}>
                <div style={{
                  width: '2px',
                  height: mark === 0 ? '16px' : '8px',
                  background: mark === 0 ? SKMRPH1_STYLES.markCenterBackground : SKMRPH1_STYLES.markBackground,
                  borderRadius: '1px',
                  boxShadow: mark === 0 ? SKMRPH1_STYLES.marckCenterShadow : SKMRPH1_STYLES.markShadow
                }} />
              </div>
            ))}
          </div>

          <div style={{
            position: 'relative',
            height: '100%',
            display: 'flex',
            alignItems: 'center',
            paddingTop: '36px'
          }}>
            <div style={{
              position: 'absolute',
              left: '0',
              right: '0',
              height: '12px',
              top: 'calc(50%)',
              transform: 'translateY(-50%)',
              borderRadius: '6px',
              boxShadow: SKMRPH1_STYLES.trackShadow
            }} />

            <div style={{
              position: 'absolute',
              left: '0',
              right: `${100 - normalizedValue * 100}%`,
              height: '12px',
              top: 'calc(50%)',
              transform: 'translateY(-50%)',
              background: isTooLow
                ? SKMRPH1_STYLES.progressBackgroundLow
                : SKMRPH1_STYLES.progressBackground,
              boxShadow: isTooLow
                ? SKMRPH1_STYLES.progressLowShadow
                : SKMRPH1_STYLES.progressShadow,
                  borderRadius: '6px 0 0 6px',
            }} />

            <div
              style={{
                position: 'absolute',
                left: `calc(${normalizedValue * 100}% - 20px)`,
                top: "26px",
                width: '40px',
                height: '60px',
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
                  const x = Math.max(0, Math.min(e.clientX - rect.left, rect.width))
                  const newValue = (x / rect.width) * 2 - 1
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
            bottom: '8px',
            left: '16px',
            right: '16px',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center'
          }}>
            <div style={{
              fontFamily: '"Consolas", "Monaco", monospace',
              fontSize: GLOBAL_STYLE.GLOBAL_FONT_PRIMARY.fontSize,
              color: '#3a4a5a',
              letterSpacing: '1px'
            }}>MIN</div>
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
            }}>MAX</div>
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