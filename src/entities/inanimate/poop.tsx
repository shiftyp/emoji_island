import React from 'react'
import { useRandomEmoji, useAction, story, useScale } from '../../core/logic'
import { Square, PositionProps } from '../../core/square'

export const Poop: React.FunctionComponent<PositionProps> = ({
  id,
  self,
  position,
  className,
  state,
}) => {
  const { behave, act } = useAction(position, state)
  const scale = React.useMemo(() => Math.random() * 0.5 + 0.5, [])

  behave(
    ({ look, replace, create }) => {
      const entity = Math.random() < 0.5 ? create('Tree') : create('Space')
      replace(story`${self} became ${entity}`, self, entity)
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
      scale={scale}
      position={position}
      background="rgba(0, 0, 0, 0.25)"
    >
      {useRandomEmoji('💩')}
    </Square>
  )
}
