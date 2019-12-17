import React from 'react'
import { useRandomEmoji, useAction } from '../../core/logic'
import { Square, PositionProps } from '../../core/square'
import { story, plusEnergy, minusEnergy } from '../../utils'

export const Carnivore: React.FunctionComponent<PositionProps> = ({
  id,
  position,
  self,
  state,
}) => {
  const { behave, act } = useAction(position, state)

  behave(
    ({ look, replace, create }) => {
      const herbivore = look('Herbivore')
      const space = look('Space')

      if (herbivore) {
        replace(story`${self} ate ${herbivore}`, herbivore, plusEnergy(self, 5))
      } else if (self.energy <= 0) {
        const bones = create('Bones')

        replace(story`${self} starved to ${bones}`, self, bones)
      } else if (space) {
        replace(story`${self} moved to ${space}`, space, minusEnergy(self))
      }
    },
    id,
    2
  )

  return (
    <Square
      onClick={act(({ replace, create }) => {
        replace(story`${self} died`, self, create('Bones'))
      })}
      background="rgba(255, 50, 50, 0.25)"
      title={story`${self}`}
      position={position}
      scale={1.5}
    >
      {useRandomEmoji('🐅', '🐆')}
    </Square>
  )
}
