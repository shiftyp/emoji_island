import React from 'react'
import { useRandomEmoji, useAction, story } from '../../core/logic'
import { Square, PositionProps } from '../../core/square'

export const Fire: React.FunctionComponent<PositionProps> = ({
  id,
  self,
  position,
  className,
  state,
}) => {
  const { behave, act } = useAction(position, state)

  behave(
    ({ look, replace, create }) => {
      const tree = look('Tree')
      const fire = create('Fire')

      if (Math.random() < 0.5) {
        replace(story`${self} burnt out`, self, create('Space'))
      }
      if (tree) {
        replace(story`${fire} burned ${tree}`, tree, fire)
      }
    },
    id,
    1
  )

  return (
    <Square
      className={className}
      key="square"
      title={story`extinguish ${self}`}
      onClick={act(({ replace, create }) => {
        replace(story`${self} extinguished`, self, create('Space'))
      })}
      scale={Math.random() + 1.5}
      position={position}
      background="rgba(255, 100, 100, 0.25)"
    >
      {useRandomEmoji('🔥')}
    </Square>
  )
}
