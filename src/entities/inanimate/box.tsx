import React from 'react'

import { Square, PositionProps } from '../../core/square'
import { useAction, useRandomEmoji } from '../../core/logic'
import { story } from '../../utils'

export const Box: React.FunctionComponent<PositionProps> = ({
  id,
  position,
  self,
  state,
}) => {
  const { behave, act } = useAction(position, state, id)

  behave(({ replace, create }) => {
    const entity =
      Math.random() < 0.1 ? create('Carnivore') : create('Herbivore')
    replace(story`${self} became a ${entity}`, self, entity)
  }, 5)

  return (
    <Square
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
