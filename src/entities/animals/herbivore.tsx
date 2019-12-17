import React from 'react'
import {
  useRandomEmoji,
  useAction,
  story,
  plusEnergy,
  minusEnergy,
} from '../../core/logic'
import { Square, PositionProps } from '../../core/square'

export const Herbivore: React.FunctionComponent<PositionProps> = ({
  id,
  position,
  self,
}) => {
  const { behave, act } = useAction(position)

  behave(({ look, replace, create }) => {
    const fruit = look('Fruit')
    const herbivore = look('Herbivore')
    const space = look('Space')

    if (fruit) {
      replace(story`${self} ate ${fruit}`, fruit, plusEnergy(self, 10))
    } else if (herbivore && space && self.energy > 15 && Math.random() < 0.05) {
      const baby = create('Herbivore')

      replace(story`${self} made ${baby} with ${herbivore}`, space, baby)
    } else if (self.energy <= 0) {
      const bones = create('Bones')

      replace(story`${self} starved to ${bones}`, self, bones)
    } else if (space) {
      replace(
        story`${self} moved to ${space}`,
        space,
        minusEnergy(self),
        self.energy > 15 && Math.random() < 0.1
          ? create('Poop')
          : create('Space')
      )
    }
  }, 1)

  return (
    <Square
      title={story`Kill ${self}`}
      position={position}
      scale={1}
      background="rgba(255, 255, 255, 0.25)"
      onClick={act(({ replace, create }) => {
        replace(story`${self} died`, self, create('Bones'))
      })}
    >
      {useRandomEmoji('🐑', '🐏')}
    </Square>
  )
}
