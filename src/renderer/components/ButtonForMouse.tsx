import React, { useState } from 'react'
import { GLOBAL_COLOR } from '../style/color'

const ButtonForMouse: React.FC<{
	style?: React.CSSProperties,
	styleOn?: React.CSSProperties,
	styleOff?: React.CSSProperties,
	styleHover?: React.CSSProperties,
	pIsOn?: boolean,
	onClick?: (e: React.MouseEvent) => void,
	onMouseOver?: () => void,
	onMouseOut?: () => void,
	children?: React.ReactNode,
}> = ({
	style = {},
	styleOn = {},
	styleOff = {},
	styleHover = {},
	pIsOn = false,
	onClick = (e: React.MouseEvent) => { },
	onMouseOver = () => { },
	onMouseOut = () => { },
	children = null,
}) => {
	const defaultStyle = {
		background: GLOBAL_COLOR.TRANSPARENT,
		border: "none",
	}
	const [isHover, setIsHover] = useState(false)

	return (
		<button
			style={{
				...defaultStyle,
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
