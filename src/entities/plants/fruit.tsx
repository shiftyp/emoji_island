import React from 'react'
import { useRandomEmoji, useAction } from '../../core/logic'
import { Square, PositionProps } from '../../core/square'
import { story } from '../../core/utils'

export const Fruit: React.FunctionComponent<PositionProps> = ({
  id,
  self,
  position,
  state,
}) => {
  const { behave, act } = useAction(position, state, id)

  behave(({ create, replace }) => {
    const tree = create('Tree')
    const space = create('Space')

    Math.random() > 0.5
      ? replace(story`${self} made ${tree}`, self, tree)
      : replace(story`${self} left ${space}`, self, space)
  }, 10)

  return (
    <Square
      title={story`destroy ${self}`}
      onClick={act(({ replace, create }) => {
        replace(story`${self} destroyed`, self, create('Space'))
      })}
      background="rgba(255, 255, 0, 0.25)"
      position={position}
      scale={0.75}
    >
      {useRandomEmoji('🍏', '🍎', '🍐', '🍊', '🍋', '🍑', '🥭')}
    </Square>
  )
}
