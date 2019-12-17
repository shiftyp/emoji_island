import React from 'react'

import { Square, PositionProps } from '../../core/square'
import { useAction, story } from '../../core/logic'

export const Space: React.FunctionComponent<PositionProps> = ({
  position,
  self,
}) => {
  const { act } = useAction(position)

  return (
    <Square
      key="square"
      fadeIn={false}
      background="rgba(50, 50, 50, 0.25)"
      title={story`Create box at ${self}`}
      position={position}
      onClick={act(({ replace, create }) => {
        const box = create('Box')
        replace(story`You created ${box}`, self, box)
      })}
    >
      {' '}
    </Square>
  )
}
