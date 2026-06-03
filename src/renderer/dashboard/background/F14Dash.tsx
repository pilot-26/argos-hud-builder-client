import { GLOBAL_COLOR } from "../../style/color"
import { GLOBAL_STYLE } from "../../style/style"

export const F14Dash: React.FC = () => {
  return (
    <div style={{
      position: 'absolute',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      background: `
        linear-gradient(135deg, #2a2a2a 0%, #1a1a1a 50%, #2a2a2a 100%),
        url("data:image/svg+xml,%3Csvg viewBox='0 0 400 400' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)' opacity='0.08'/%3E%3C/svg%3E")
      `,
      display: "grid",
      gridTemplateColumns: "1fr 1fr 1fr 1fr",
      gridTemplateRows: "1fr 1fr 1fr 1fr",
      gridGap: "10px",
      padding: GLOBAL_STYLE.GLOBAL_PADDING_LARGE,
      boxShadow: 'inset 0 0 50px rgba(0,0,0,0.8)',
      overflow: 'hidden'
    }}>
      {/* Scratch marks overlay */}
      <svg style={{
        position: 'absolute',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        pointerEvents: 'none',
        opacity: 0.6
      }} viewBox="0 0 1000 1000" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <filter id="scratchFilter">
            <feTurbulence type="fractalNoise" baseFrequency="0.04" numOctaves="5" result="noise"/>
            <feDisplacementMap in="SourceGraphic" in2="noise" scale="2" xChannelSelector="R" yChannelSelector="G"/>
          </filter>
        </defs>
        <g filter="url(#scratchFilter)">
          <line x1="100" y1="50" x2="250" y2="120" stroke="#444" strokeWidth="1.5" opacity="0.5"/>
          <line x1="300" y1="80" x2="450" y2="50" stroke="#333" strokeWidth="1" opacity="0.4"/>
          <line x1="600" y1="150" x2="750" y2="200" stroke="#444" strokeWidth="2" opacity="0.6"/>
          <line x1="150" y1="300" x2="280" y2="350" stroke="#333" strokeWidth="1.2" opacity="0.45"/>
          <line x1="400" y1="250" x2="520" y2="300" stroke="#444" strokeWidth="1.8" opacity="0.55"/>
          <line x1="700" y1="400" x2="850" y2="350" stroke="#333" strokeWidth="1.4" opacity="0.42"/>
          <line x1="200" y1="500" x2="350" y2="550" stroke="#444" strokeWidth="1.6" opacity="0.52"/>
          <line x1="500" y1="600" x2="620" y2="650" stroke="#333" strokeWidth="1.1" opacity="0.38"/>
          <line x1="800" y1="550" x2="920" y2="600" stroke="#444" strokeWidth="1.7" opacity="0.58"/>
          <line x1="50" y1="700" x2="180" y2="750" stroke="#333" strokeWidth="1.3" opacity="0.48"/>
          <line x1="300" y1="750" x2="450" y2="800" stroke="#444" strokeWidth="1.9" opacity="0.62"/>
          <line x1="550" y1="800" x2="680" y2="850" stroke="#333" strokeWidth="1.2" opacity="0.46"/>
          <line x1="750" y1="700" x2="900" y2="780" stroke="#444" strokeWidth="1.6" opacity="0.54"/>
          <line x1="100" y1="850" x2="250" y2="900" stroke="#333" strokeWidth="1" opacity="0.35"/>
          <line x1="400" y1="900" x2="550" y2="950" stroke="#444" strokeWidth="1.8" opacity="0.6"/>
          <line x1="650" y1="880" x2="800" y2="930" stroke="#333" strokeWidth="1.4" opacity="0.44"/>
        </g>
      </svg>

      {/* Instrument panels */}
      <div style={{
        borderRadius: '12px',
        background: `
          linear-gradient(145deg, #1e1e1e, #2a2a2a),
          radial-gradient(ellipse at top, rgba(100,100,100,0.1) 0%, transparent 60%)
        `,
        gridColumnStart: 1,
        gridColumnEnd: 3,
        gridRowStart: 1,
        gridRowEnd: 3,
        boxShadow: `
          inset 2px 2px 5px rgba(0,0,0,0.5),
          inset -2px -2px 5px rgba(60,60,60,0.3),
          3px 3px 10px rgba(0,0,0,0.6),
          -1px -1px 3px rgba(80,80,80,0.2)
        `,
        border: '1px solid #333',
        position: 'relative'
      }}>
        <div style={{
          position: 'absolute',
          top: '8px',
          left: '8px',
          right: '8px',
          bottom: '8px',
          borderRadius: '8px',
          background: `
            radial-gradient(ellipse at center, #0a0a0a 0%, #000 100%),
            repeating-linear-gradient(
              0deg,
              transparent,
              transparent 2px,
              rgba(0,255,0,0.02) 2px,
              rgba(0,255,0,0.02) 4px
            )
          `,
          boxShadow: 'inset 0 0 20px rgba(0,255,0,0.1)'
        }}/>
      </div>

      <div style={{
        borderRadius: '12px',
        background: `
          linear-gradient(145deg, #1e1e1e, #2a2a2a),
          radial-gradient(ellipse at top, rgba(100,100,100,0.1) 0%, transparent 60%)
        `,
        gridColumnStart: 3,
        gridColumnEnd: 5,
        gridRowStart: 1,
        gridRowEnd: 2,
        boxShadow: `
          inset 2px 2px 5px rgba(0,0,0,0.5),
          inset -2px -2px 5px rgba(60,60,60,0.3),
          3px 3px 10px rgba(0,0,0,0.6),
          -1px -1px 3px rgba(80,80,80,0.2)
        `,
        border: '1px solid #333',
        position: 'relative'
      }}>
        <div style={{
          position: 'absolute',
          top: '8px',
          left: '8px',
          right: '8px',
          bottom: '8px',
          borderRadius: '8px',
          background: `
            radial-gradient(ellipse at center, #0a0a0a 0%, #000 100%),
            repeating-linear-gradient(
              0deg,
              transparent,
              transparent 2px,
              rgba(255,0,0,0.02) 2px,
              rgba(255,0,0,0.02) 4px
            )
          `,
          boxShadow: 'inset 0 0 20px rgba(255,0,0,0.1)'
        }}/>
      </div>

      <div style={{
        borderRadius: '12px',
        background: `
          linear-gradient(145deg, #1e1e1e, #2a2a2a),
          radial-gradient(ellipse at top, rgba(100,100,100,0.1) 0%, transparent 60%)
        `,
        gridColumnStart: 3,
        gridColumnEnd: 5,
        gridRowStart: 2,
        gridRowEnd: 3,
        boxShadow: `
          inset 2px 2px 5px rgba(0,0,0,0.5),
          inset -2px -2px 5px rgba(60,60,60,0.3),
          3px 3px 10px rgba(0,0,0,0.6),
          -1px -1px 3px rgba(80,80,80,0.2)
        `,
        border: '1px solid #333',
        position: 'relative'
      }}>
        <div style={{
          position: 'absolute',
          top: '8px',
          left: '8px',
          right: '8px',
          bottom: '8px',
          borderRadius: '8px',
          background: `
            radial-gradient(ellipse at center, #0a0a0a 0%, #000 100%),
            repeating-linear-gradient(
              0deg,
              transparent,
              transparent 2px,
              rgba(0,200,255,0.02) 2px,
              rgba(0,200,255,0.02) 4px
            )
          `,
          boxShadow: 'inset 0 0 20px rgba(0,200,255,0.1)'
        }}/>
      </div>

      <div style={{
        borderRadius: '12px',
        background: `
          linear-gradient(145deg, #1e1e1e, #2a2a2a),
          radial-gradient(ellipse at top, rgba(100,100,100,0.1) 0%, transparent 60%)
        `,
        gridColumnStart: 1,
        gridColumnEnd: 5,
        gridRowStart: 3,
        gridRowEnd: 5,
        boxShadow: `
          inset 2px 2px 5px rgba(0,0,0,0.5),
          inset -2px -2px 5px rgba(60,60,60,0.3),
          3px 3px 10px rgba(0,0,0,0.6),
          -1px -1px 3px rgba(80,80,80,0.2)
        `,
        border: '1px solid #333',
        position: 'relative'
      }}>
        <div style={{
          position: 'absolute',
          top: '8px',
          left: '8px',
          right: '8px',
          bottom: '8px',
          borderRadius: '8px',
          background: `
            radial-gradient(ellipse at center, #0a0a0a 0%, #000 100%),
            repeating-linear-gradient(
              0deg,
              transparent,
              transparent 2px,
              rgba(255,255,0,0.02) 2px,
              rgba(255,255,0,0.02) 4px
            )
          `,
          boxShadow: 'inset 0 0 20px rgba(255,255,0,0.1)'
        }}/>
      </div>
    </div>
  )
}