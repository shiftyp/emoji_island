import React from 'react'
import { useRandomEmoji, useScale, useAction } from '../../core/logic'
import { Square, PositionProps } from '../../core/square'
import { story } from '../../core/utils'

export const Volcano: React.FunctionComponent<PositionProps> = ({
  position,
  self,
  id,
  state,
}) => {
  const { act, behave } = useAction(position, state, id)

  behave(({ look, create, replace }) => {
    const flammable = look('Space') || look('Tree')
    const fire = create('Fire')

    if (flammable) replace(story`${self} spewed ${fire}`, flammable, fire)
  }, 1)

  return (
    <Square
      title={story`${self}`}
      scale={useScale(() => Math.random() + 3)}
      background="rgba(255, 100, 100, 0.5)"
      position={position}
      onClick={act(({ replace, create }) => {
        replace(story`${self} removed`, self, create('Space'))
      })}
    >
      {useRandomEmoji('🌋')}
    </Square>
  )
}
