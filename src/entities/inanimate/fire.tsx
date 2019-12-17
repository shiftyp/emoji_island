import React from 'react'
import { useRandomEmoji, useAction, story } from '../../core/logic'
import { Square, PositionProps } from '../../core/square'

export const Fire: React.FunctionComponent<PositionProps> = ({
  self,
  position,
}) => {
  const { behave, act } = useAction(position)

  behave(({ look, replace, create }) => {
    const tree = look('Tree')
    const fire = create('Fire')

    if (tree) {
      replace(story`${fire} burned ${tree}`, tree, fire)
    }
  }, 1)

  behave(({ look, replace, create }) => {
    const space = create('Space')
    replace(story`${self} burnt out`, self, space)
  }, 5)

  return (
    <Square
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
