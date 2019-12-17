import React from 'react'
import { useRandomEmoji, useAction, story, useScale } from '../../core/logic'
import { Square, PositionProps } from '../../core/square'

export const Tree: React.FunctionComponent<PositionProps> = ({
  id,
  self,
  position,
  className,
  state,
}) => {
  const { behave, act } = useAction(position, state)

  behave(
    ({ look, replace, create }) => {
      const space = look('Space')

      if (space) {
        const fruit = create('Fruit')

        replace(story`${self} made ${fruit}`, space, fruit)
      }

      if (Math.random() < 0.001) {
        const fire = create('Fire')
        replace(story`${self} combusted into ${fire}`, self, fire)
      }
    },
    id,
    10
  )

  return (
    <Square
      className={className}
      key="square"
      title={story`burn ${self}`}
      position={position}
      background="rgba(52, 115, 68, 0.25)"
      scale={useScale(() => Math.random() + 2)}
      onClick={act(({ replace, create }) => {
        const fire = create('Fire')

        replace(story`${fire} burned ${self}`, self, fire)
      })}
    >
      {useRandomEmoji('🌲', '🌳', '🌴')}
    </Square>
  )
}
