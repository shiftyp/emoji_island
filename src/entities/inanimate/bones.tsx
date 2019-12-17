import React from 'react'
import { useRandomEmoji, useAction, story, useScale } from '../../core/logic'
import { Square, PositionProps } from '../../core/square'

export const Bones: React.FunctionComponent<PositionProps> = ({
  id,
  self,
  position,
  className,
  state,
}) => {
  const { behave, act } = useAction(position, state)

  behave(
    ({ look, replace, create }) => {
      const entity = Math.random() < 0.001 ? create('Tree') : create('Space')
      replace(story`${self} decomposed into ${entity}`, self, entity)
    },
    id,
    10
  )

  return (
    <Square
      className={className}
      key="square"
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
