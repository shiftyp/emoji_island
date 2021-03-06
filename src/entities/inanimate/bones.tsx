import React from 'react'
import { useRandomEmoji, useAction, useScale } from '../../core/logic'
import { Square, PositionProps } from '../../core/square'
import { story } from '../../core/utils'

export const Bones: React.FunctionComponent<PositionProps> = ({
  id,
  self,
  position,
  state,
}) => {
  const { behave, act } = useAction(position, state, id)

  behave(({ look, replace, create }) => {
    const entity = Math.random() < 0.001 ? create('Tree') : create('Space')
    replace(story`${self} decomposed into ${entity}`, self, entity)
  }, 10)

  return (
    <Square
      title={story`Decompose ${self}`}
      onClick={act(({ replace, create }) => {
        replace(story`${self} decomposed`, self, create('Space'))
      })}
      scale={useScale(() => Math.random() + 1.5)}
      position={position}
      background="rgba(0, 0, 0, 0.25)"
    >
      {useRandomEmoji('🦴', '💀')}
    </Square>
  )
}
