import React from 'react'

import { Square, PositionProps } from '../../core/square'
import { useAction } from '../../core/logic'
import { story } from '../../utils'

export const Space: React.FunctionComponent<PositionProps> = ({
  id,
  position,
  self,
  state,
}) => {
  const { act } = useAction(position, state, id)

  return (
    <Square
      animate={false}
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
