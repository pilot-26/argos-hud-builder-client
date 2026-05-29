import React, { useState } from 'react'

const ButtonForMouse: React.FC<{
    style?: React.CSSProperties,
    styleOn?: React.CSSProperties,
    styleOff?: React.CSSProperties,
    styleHover?: React.CSSProperties,
    pIsOn?: boolean,
    onClick?: () => void,
    onMouseOver?: () => void,
    onMouseOut?: () => void,
    children?: React.ReactNode,
}> = ({ 
    style = {},
    styleOn = {},
    styleOff = {},
    styleHover = {},
    pIsOn = false,
    onClick = () => {},
    onMouseOver = () => {},
    onMouseOut = () => {},
    children = null,
}) => {
    const [isHover, setIsHover] = useState(false)

    return (
        <button
            style={{
                ...style,
                ...(pIsOn ? styleOn : styleOff),
                ...(isHover ? styleHover : {}),
                transition: 'all 0.2s ease',
            }}
            onClick={onClick}
            onMouseOver={() => {
                onMouseOver()
                setIsHover(true)
            }}
            onMouseOut={() => {
                onMouseOut()
                setIsHover(false)
            }}
        >
            {children}
        </button>
    )
}

export default ButtonForMouse
