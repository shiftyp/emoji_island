import React from 'react'
import { useRandomEmoji, useScale, useAction } from '../../core/logic'
import { Square, PositionProps } from '../../core/square'
import { story } from '../../core/utils'

export const Mountain: React.FunctionComponent<PositionProps> = ({
  position,
  self,
  state,
  id,
}) => {
  const { act, behave } = useAction(position, state, id)

  behave(({ create, replace }) => {
    if (Math.random() < 0.1) {
      const volcano = create('Volcano')

      replace(story`${self} erupted into ${volcano}`, self, volcano)
    }
  }, 100)

  return (
    <Square
      title={story`${self}`}
      scale={useScale(() => Math.random() + 3)}
      background="rgba(100, 100, 100, 0.5)"
      position={position}
      onClick={act(({ replace, create }) => {
        const volcano = create('Volcano')
        replace(story`${self} turned into volcano`, self, volcano)
      })}
    >
      {useRandomEmoji('⛰', '🏔')}
    </Square>
  )
}
