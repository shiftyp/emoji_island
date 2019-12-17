import fake from 'faker'

import {
  useRef,
  useReducer,
  useMemo,
  createContext,
  useContext,
  useCallback,
  MutableRefObject,
  useEffect,
} from 'react'

import * as Animals from '../entities/animals'
import * as Plants from '../entities/plants'
import * as Inanimate from '../entities/inanimate'
import { PositionProps } from '../core'

export type SquareStates = 'entering' | 'exiting' | 'entered' | 'exited'

export type Entity = Readonly<{
  name: string
  id: string
  component: React.FunctionComponent<PositionProps>
  energy: number
  animate: boolean
}>

const shuffle = <T>(array: T[]): T[] => {
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

type World = Entity[]

type Update = [number, string, Entity]

type SourceEntity = Readonly<{
  name: string
  probability: number
  component: React.FunctionComponent
  makeId: () => string
  startingEnergy: number
  animate: boolean
}>

const createEntityFromSource = ({
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

const sources: SourceEntity[] = [
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

const generateWorld = (width: number, height: number) => {
  const world: World = []

  const totalProbability = sources.reduce(
    (total, entity) => total + entity.probability,
    0
  )

  for (let i = 0; i < height; i++) {
    for (let j = 0; j < width; j++) {
      let rand = Math.random() * totalProbability

      const source = sources.find(entity => {
        rand -= entity.probability
        return rand <= 0
      })

      world.push(createEntityFromSource(source))
    }
  }

  return world
}

export const pickRandom = <T>(arr: Array<T>): T =>
  arr[Math.trunc(Math.random() * arr.length)]

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

export const useRandomEmoji = (...emojis: string[]) =>
  useRef(pickRandom(emojis)).current

export const useScale = (fn: () => number) => useMemo(fn, [])

export type Look = (name: string) => Entity | null
export type Replace = (
  historyEntry: string,
  target: Entity,
  replacement: Entity,
  filler?: Entity
) => void
export type Create = (name: string) => Entity

export type Action = (context: {
  replace: Replace
  create: Create
  look: Look
}) => void

export const WorldContext = createContext<{
  act: (
    position: MutableRefObject<Coordinate>
  ) => (action: Action, id: string, steps: number) => void
  replace: Replace
  create: Create
}>(null)

export type History = number[]

export const useWorld = (width: number, height: number) => {
  const initialWorld = useMemo(() => generateWorld(width, height), [
    height,
    width,
  ])
  const step = useRef<number>(0)
  const [paused, togglePaused] = useReducer(
    (paused, _: never) => !paused,
    false
  )

  const [{ world, history, ids }, updateWorld] = useReducer(
    (
      state: {
        world: World
        history: History
        ids: Record<string, true>
      },
      updates: Update[]
    ) =>
      updates.reduce(({ world, history }, [index, historyEntry, entity]) => {
        console.log(step.current, historyEntry)
        const newWorld = [
          ...world.slice(0, index),
          entity,
          ...world.slice(index + 1),
        ]

        return {
          ids: newWorld.reduce(
            (ids, entity) => ({
              ...ids,
              [entity.id]: true,
            }),
            {}
          ),
          world: newWorld,
          history: [
            ...history.slice(0, step.current),
            (history[step.current] || 0) + 1,
            ...history.slice(step.current + 1),
          ],
        }
      }, state),
    {
      world: initialWorld,
      history: [],
      ids: initialWorld.reduce(
        (ids, entity) => ({
          ...ids,
          [entity.id]: true,
        }),
        {}
      ),
    }
  )

  const peek = useCallback(
    ([x, y]: Coordinate) =>
      x < 0 || x >= width || y < 0 || y >= width
        ? null
        : world[y * width + x] || null,
    [world]
  )

  const replace = (
    historyEntry: string,
    target: Entity,
    replacement: Entity,
    filler = create('Space')
  ) => {
    const replacementIndex = world.findIndex(
      entity => entity.id === replacement.id
    )
    const index = world.findIndex(entity => entity.id === target.id)
    const updates: Update[] = [[index, historyEntry, replacement]]

    if (replacementIndex >= 0) {
      updates.push([
        replacementIndex,
        story`${replacement} left ${filler}`,
        filler,
      ])
    }

    updateWorld(updates)
  }

  let actions: Record<
    string,
    [number, React.MutableRefObject<Coordinate>, Action]
  > = {}

  let act = (positionRef: MutableRefObject<Coordinate>) => (
    action: Action,
    id: string,
    steps: number
  ) => {
    actions[id] = [steps, positionRef, action]
  }

  let create: Create = useCallback(
    name => createEntityFromSource(sourcesMap[name]),
    []
  )

  useEffect(() => {
    if (!paused) {
      const interval = setInterval(() => {
        if (paused) return
        step.current++
        const { updates } = shuffle(Object.keys(actions)).reduce(
          ({ updates, updatedIds }, key) => {
            if (!ids[key] || updatedIds[key]) {
              return { updates, updatedIds }
            }
            const [steps, positionRef, action] = actions[key]

            if (step.current % steps === 0) {
              action({
                replace: (
                  historyEntry,
                  target,
                  replacement,
                  filler = create('Space')
                ) => {
                  if (updatedIds[target.id] || updatedIds[replacement.id]) {
                    return
                  }
                  const index = world.findIndex(
                    entity => entity.id === target.id
                  )
                  const replacementIndex = world.findIndex(
                    entity => entity.id === replacement.id
                  )

                  if (updates[index] || updates[replacementIndex]) {
                    return
                  }
                  if (index >= 0) {
                    updates[index] = [index, historyEntry, replacement]
                    updatedIds[replacement.id] = true
                    updatedIds[target.id] = true
                  }
                  if (replacementIndex >= 0) {
                    updatedIds[filler.id] = true
                    updates[replacementIndex] = [
                      replacementIndex,
                      story`${replacement} left ${filler}`,
                      filler,
                    ]
                  }
                },
                create,
                look: (name: string) =>
                  lookAround(
                    positionRef.current,
                    peek,
                    entity => entity.name === name
                  ),
              })
            }

            return { updates, updatedIds }
          },
          {
            updates: [],
            updatedIds: {},
          } as {
            updates: Update[]
            updatedIds: Record<string, true>
          }
        )

        updateWorld(Object.keys(updates).map(key => updates[key]))
      }, 1000)

      return () => clearInterval(interval)
    }
  })

  return { world, act, replace, history, create, togglePaused, paused }
}

export type Coordinate = [number, number]

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

export const usePosition = (position: Coordinate) => {
  const ref = useRef<Coordinate>()

  ref.current = position

  return ref
}

export const useAction = (position: Coordinate, state: SquareStates) => {
  const { act, replace, create } = useContext(WorldContext)
  const positionRef = usePosition(position)

  if (state !== 'entered') {
    return {
      behave: () => {},
      act: () => () => {},
    }
  }

  return {
    behave: act(positionRef),
    act: (cb: (context: { replace: Replace; create: Create }) => void) => () =>
      cb({ replace, create }),
  }
}
