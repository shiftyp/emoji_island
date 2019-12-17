import fake from 'faker'

import { PositionProps } from '../core'

import * as Animals from '../entities/animals'
import * as Plants from '../entities/plants'
import * as Inanimate from '../entities/inanimate'

export type Entity = Readonly<{
  name: string
  id: string
  component: React.FunctionComponent<PositionProps>
  energy: number
  animate: boolean
}>

export type SourceEntity = Readonly<{
  name: string
  probability: number
  component: React.FunctionComponent
  makeId: () => string
  startingEnergy: number
  animate: boolean
}>

export const createEntityFromSource = ({
  name,
  component,
  makeId,
  startingEnergy,
  animate,
}: SourceEntity): Entity => ({
  id: makeId(),
  name,
  component,
  energy: startingEnergy,
  animate,
})

export const sources: SourceEntity[] = [
  {
    name: 'Space',
    probability: 0.1,
    component: Inanimate.Space,
    makeId: () => `${fake.company.bsBuzz()} ${fake.random.alphaNumeric(3)}`,
    startingEnergy: 0,
    animate: false,
  },
  {
    name: 'Mountain',
    probability: 0.01,
    component: Inanimate.Mountain,
    makeId: () =>
      `${fake.company.bsAdjective()} ${fake.company.bsNoun()} ${fake.random.alphaNumeric(
        3
      )}`,
    startingEnergy: 0,
    animate: false,
  },
  {
    name: 'Tree',
    probability: 0.02,
    component: Plants.Tree,
    makeId: () => fake.random.alphaNumeric(12),
    startingEnergy: 0,
    animate: true,
  },
  {
    name: 'Fruit',
    probability: 0,
    component: Plants.Fruit,
    makeId: () => fake.random.alphaNumeric(12),
    startingEnergy: 0,
    animate: true,
  },
  {
    name: 'Herbivore',
    probability: 0.01,
    component: Animals.Herbivore,
    makeId: () =>
      `${fake.name.prefix()} ${fake.name.firstName()} ${fake.random.alphaNumeric(
        3
      )}`,
    startingEnergy: 20,
    animate: true,
  },
  {
    name: 'Carnivore',
    probability: 0.005,
    component: Animals.Carnivore,
    makeId: () => `${fake.name.firstName()} ${fake.random.alphaNumeric(6)}`,
    startingEnergy: 10,
    animate: true,
  },
  {
    name: 'Fire',
    probability: 0,
    component: Inanimate.Fire,
    makeId: () => fake.random.alphaNumeric(12),
    startingEnergy: 0,
    animate: true,
  },
  {
    name: 'Bones',
    probability: 0,
    component: Inanimate.Bones,
    startingEnergy: 0,
    makeId: () => fake.random.alphaNumeric(12),
    animate: true,
  },
  {
    name: 'Box',
    probability: 0,
    component: Inanimate.Box,
    startingEnergy: 0,
    makeId: () => fake.random.alphaNumeric(12),
    animate: true,
  },
  {
    name: 'Poop',
    probability: 0,
    component: Inanimate.Poop,
    startingEnergy: 0,
    makeId: () => fake.random.alphaNumeric(12),
    animate: true,
  },
]

export const sourcesMap: Record<string, SourceEntity> = sources.reduce(
  (map, source) => ({
    ...map,
    [source.name]: source,
  }),
  {}
)
