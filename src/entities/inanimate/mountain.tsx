import React from 'react'
import { useRandomEmoji, story, useScale } from '../../core/logic'
import { Square, PositionProps } from '../../core/square'

export const Mountain: React.FunctionComponent<PositionProps> = ({
  position,
  self,
  className,
}) => {
  return (
    <Square
      className={className}
      key="square"
      title={story`${self}`}
      scale={useScale(() => Math.random() + 3)}
      background="rgba(100, 100, 100, 0.5)"
      position={position}
    >
      {useRandomEmoji('⛰', '🏔')}
    </Square>
  )
}
