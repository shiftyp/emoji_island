import React from 'react'
import { useRandomEmoji, useAction, story } from '../../core/logic'
import { Square, PositionProps } from '../../core/square'

export const Bones: React.FunctionComponent<PositionProps> = ({
  self,
  position,
}) => {
  const { behave, act } = useAction(position)

  behave(({ look, replace, create }) => {
    const entity = Math.random() < 0.001 ? create('Tree') : create('Space')
    replace(story`${self} decomposed into ${entity}`, self, entity)
  }, 10)

  return (
    <Square
      key="square"
      title={story`Decompose ${self}`}
      onClick={act(({ replace, create }) => {
        replace(story`${self} decomposed`, self, create('Space'))
      })}
      scale={Math.random() + 1.5}
      position={position}
      background="rgba(0, 0, 0, 0.25)"
    >
      {useRandomEmoji('🦴', '💀')}
    </Square>
  )
}
