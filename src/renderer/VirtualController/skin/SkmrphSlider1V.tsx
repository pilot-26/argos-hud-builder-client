import { GLOBAL_STYLE } from "../../style/style"

export class SkmrphSlider1H {
  static getUIElement = (
    isTooLow: boolean,
    normalizedValue: number,
    axisValue: number,
    setAxisValue: React.Dispatch<React.SetStateAction<number>>,
  ) => {
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
          background: 'linear-gradient(145deg, #2a2a3a 0%, #1a1a28 50%, #0f0f1a 100%)',
          borderRadius: '24px',
          padding: '32px 28px',
          boxShadow: `
              0 0 0 2px #3a3a4a,
              0 0 0 4px #1a1a28,
              0 25px 50px rgba(0, 0, 0, 0.8),
              0 10px 20px rgba(0, 0, 0, 0.6),
              inset 0 1px 0 rgba(255, 255, 255, 0.1),
              inset 0 -1px 0 rgba(0, 0, 0, 0.4)
            `,
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
              ? 'radial-gradient(circle at 30% 30%, #ff6b6b, #aa3333)'
              : 'radial-gradient(circle at 30% 30%, #4a5a6a, #2a3a4a)',
            boxShadow: isTooLow
              ? '0 0 8px rgba(255, 100, 100, 0.6), 0 0 16px rgba(255, 100, 100, 0.3)'
              : 'inset 0 1px 2px rgba(0,0,0,0.5)',
            transition: 'all 0.15s ease'
          }} />
          <div style={{
            width: '160px',
            height: '70vh',
            background: 'linear-gradient(180deg, #0a0a12 0%, #151520 50%, #0a0a12 100%)',
            borderRadius: '16px',
            padding: '24px',
            boxShadow: `
                inset 0 2px 8px rgba(0, 0, 0, 0.8),
                inset 0 0 0 1px rgba(0, 0, 0, 0.5),
                0 1px 0 rgba(255, 255, 255, 0.05)
              `,
            position: 'relative',
            overflow: 'hidden'
          }}>
            <div style={{
              position: 'absolute',
              top: '16px',
              left: '8px',
              bottom: '16px',
              width: '40px',
              background: 'linear-gradient(90deg, rgba(40,50,60,0.3) 0%, transparent 100%)',
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
                    background: mark === 0 ? '#4a5a6a' : '#2a3a4a',
                    borderRadius: '1px',
                    boxShadow: mark === 0 ? '0 0 6px rgba(100,150,200,0.3)' : 'none'
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
              paddingLeft: '36px'
            }}>
              <div style={{
                position: 'absolute',
                top: '0',
                bottom: '0',
                width: '12px',
                left: 'calc(50%)',
                transform: 'translateX(-50%)',
                background: 'linear-gradient(90deg, #1a1a24 0%, #252530 50%, #1a1a24 100%)',
                borderRadius: '6px',
                boxShadow: `
                    inset 0 2px 4px rgba(0, 0, 0, 0.6),
                    inset 0 -1px 0 rgba(255, 255, 255, 0.05),
                    0 1px 0 rgba(255, 255, 255, 0.02)
                  `
              }} />

              <div style={{
                position: 'absolute',
                bottom: '0',
                height: `${normalizedValue * 100}%`,
                width: '12px',
                left: 'calc(50%)',
                transform: 'translateX(-50%)',
                background: isTooLow
                  ? 'radial-gradient(circle at 30% 30%, #ff6b6b, #aa3333)'
                  : 'radial-gradient(circle at 30% 30%, #4a5a6a, #2a3a4a)',
                boxShadow: isTooLow
                  ? '0 0 8px rgba(255, 100, 100, 0.6), 0 0 16px rgba(255, 100, 100, 0.3)'
                  : 'inset 0 1px 2px rgba(0,0,0,0.5)',
                borderRadius: '0 0 6px 6px',
              }} />

              <div
                style={{
                  position: 'absolute',
                  top: `calc(${(1 - normalizedValue) * 100}% - 20px)`,
                  left: "26px",
                  width: '60px',
                  height: '40px',
                  background: `linear-gradient(135deg,
                      #4a5a6a 0%,
                      #3a4a5a 15%,
                      #2a3a4a 30%,
                      #1a2a3a 50%,
                      #2a3a4a 70%,
                      #3a4a5a 85%,
                      #4a5a6a 100%)`,
                  borderRadius: '8px',
                  border: "solid 1px rgba(0,0,0,0.5)",
                  boxShadow: `
                      0 0 0 2px #1a2a3a,
                      0 4px 12px rgba(0, 0, 0, 0.6),
                      0 8px 24px rgba(0, 0, 0, 0.4),
                      inset 0 1px 0 rgba(255, 255, 255, 0.25),
                      inset 0 -2px 4px rgba(0, 0, 0, 0.3),
                      inset 2px 0 4px rgba(0, 0, 0, 0.2),
                      inset -2px 0 4px rgba(0, 0, 0, 0.2)
                    `,
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
                color: '#3a4a5a',
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
}