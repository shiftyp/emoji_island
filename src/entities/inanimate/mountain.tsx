import React from 'react'
import { useRandomEmoji, useScale } from '../../core/logic'
import { Square, PositionProps } from '../../core/square'
import { story } from '../../utils'

export const Mountain: React.FunctionComponent<PositionProps> = ({
  position,
  self,
}) => {
  return (
    <Square
      title={story`${self}`}
      scale={useScale(() => Math.random() + 3)}
      background="rgba(100, 100, 100, 0.5)"
      position={position}
    >
      {useRandomEmoji('⛰', '🏔')}
    </Square>
  )
}
