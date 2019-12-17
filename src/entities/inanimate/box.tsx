import React from 'react'

import { Square, PositionProps } from '../../core/square'
import { useAction, story, useRandomEmoji } from '../../core/logic'

export const Box: React.FunctionComponent<PositionProps> = ({
  id,
  position,
  self,
  className,
  state,
}) => {
  const { behave, act } = useAction(position, state)

  behave(
    ({ replace, create }) => {
      const entity =
        Math.random() < 0.1 ? create('Carnivore') : create('Herbivore')
      replace(story`${self} became a ${entity}`, self, entity)
    },
    id,
    5
  )

  return (
    <Square
      key="square"
      className={className}
      scale={1.5}
      background="rgba(50, 50, 50, 0.25)"
      title={story`Destroy ${self}`}
      position={position}
      onClick={act(({ replace, create }) => {
        replace(story`You destroyed ${self}`, self, create('Space'))
      })}
    >
      {useRandomEmoji('📦')}
    </Square>
  )
}
