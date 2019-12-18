import { Entity, SourceEntity } from './types'
import { Coordinate } from './logic'

export const upcase = ([first, ...rest]: string) =>
  `${first.toUpperCase()}${rest.join('')}`

export const shuffle = <T>(array: T[]): T[] => {
  let currentIndex: number = array.length
  let temporaryValue: T
  let randomIndex: number
  const ret = array.slice()

  while (0 !== currentIndex) {
    randomIndex = Math.floor(Math.random() * currentIndex)
    currentIndex--
    temporaryValue = ret[currentIndex]
    ret[currentIndex] = ret[randomIndex]
    ret[randomIndex] = temporaryValue
  }

  return ret
}

export const minusEnergy = (entity: Entity, amt: number = 1) => ({
  ...entity,
  energy: entity.energy - amt,
})

export const plusEnergy = (entity: Entity, amt: number = 1) => ({
  ...entity,
  energy: entity.energy + amt,
})

export const story = (parts: TemplateStringsArray, ...entities: Entity[]) =>
  parts.reduce(
    (story, part, i) =>
      entities[i]
        ? `${story}${part}${entities[i].name}[${entities[i].id}]`
        : story + part,
    ''
  )

export const pickRandom = <T>(arr: Array<T>): T =>
  arr[Math.trunc(Math.random() * arr.length)]

const directions: Coordinate[] = [
  [1, 0],
  [-1, 0],
  [0, 1],
  [0, -1],
  [1, 1],
  [-1, -1],
  [1, -1],
  [-1, 1],
]

export const lookAround = (
  [x, y]: Coordinate,
  peek: (position: Coordinate) => Entity | null,
  cb: (entity: Entity) => boolean
) =>
  pickRandom(
    directions
      .map(([dx, dy]) => peek([x + dx, y + dy]))
      .filter(entity => entity && cb(entity))
  )

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
