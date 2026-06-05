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
  const styles = {
    ...SKMRPH1_STYLES,
    controlGlowBackground: 'linear-gradient(180deg, rgba(40,50,60,0.3) 0%, transparent 100%)'
  }

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
        background: styles.frameBackground,
        borderRadius: '24px',
        padding: '28px 32px',
        boxShadow: styles.frameShadow,
        height: "100%",
        width: '100%',
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
            ? styles.indicatorLowBackground
            : styles.indicatorBackground,
          boxShadow: isTooLow
            ? styles.indicatorLowShadow
            : styles.indicatorShadow,
          transition: 'all 0.15s ease'
        }} />
        <div style={{
          width: '100%',
          height: '100%',
          background: styles.controlShadeBackground,
          borderRadius: '16px',
          padding: '24px',
          boxShadow: styles.controlShadeShadow,
          position: 'relative',
        }}>
          <div style={{
            position: 'absolute',
            top: '8px',
            left: '16px',
            right: '16px',
            height: '40px',
            background: styles.controlGlowBackground,
            borderRadius: '8px 8px 0 0'
          }} />
          <div style={{
            position: 'absolute',
            width: "100%",
            top: '0px',
            left: "0px",
            padding: "0px 24px",
            display: 'flex',
            flexDirection: 'row',
            justifyContent: 'space-between',
            alignItems: 'center',
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
                  background: mark === 0 ? styles.markCenterBackground : styles.markBackground,
                  borderRadius: '1px',
                  boxShadow: mark === 0 ? styles.marckCenterShadow : styles.markShadow
                }} />
              </div>
            ))}
          </div>

          <div style={{
            position: 'relative',
            height: '100%',
            width: '100%',
            display: 'flex',
            alignItems: 'center',
          }}>
            <div style={{
              position: 'absolute',
              left: '0',
              right: '0',
              height: '12px',
              top: 'calc(50%)',
              transform: 'translateY(-50%)',
              borderRadius: '6px',
              boxShadow: styles.trackShadow
            }} />

            <div style={{
              position: 'absolute',
              left: '0',
              right: `${100 - normalizedValue * 100}%`,
              height: '12px',
              top: 'calc(50%)',
              transform: 'translateY(-50%)',
              background: isTooLow
                ? styles.progressBackgroundLow
                : styles.progressBackground,
              boxShadow: isTooLow
                ? styles.progressLowShadow
                : styles.progressShadow,
                  borderRadius: '6px 0 0 6px',
            }} />

            <div
              style={{
                position: 'absolute',
                left: `calc(${normalizedValue * 100}% - 20px)`,
                top: `calc(50% - ${styles.knobWidth} / 2)`,
                width: '40px',
                height: styles.knobWidth,
                background: styles.knobBackground,
                borderRadius: '8px',
                border: styles.knobBorder,
                boxShadow: styles.knobShadow,
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
              fontSize: GLOBAL_STYLE.GLOBAL_TEXT_PRIMARY.fontSize,
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
              fontSize: GLOBAL_STYLE.GLOBAL_TEXT_PRIMARY.fontSize,
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