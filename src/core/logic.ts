import {
  useRef,
  useReducer,
  useMemo,
  createContext,
  useContext,
  useCallback,
  MutableRefObject,
  useEffect,
  useState,
} from 'react'
import { sources } from '../entities'
import {
  story,
  shuffle,
  pickRandom,
  lookAround,
  createEntityFromSource,
} from './utils'
import { Entity, SourceEntity } from './types'

export type SquareStates = 'entering' | 'exiting' | 'entered' | 'exited'

export const sourcesMap: Record<string, SourceEntity> = sources.reduce(
  (map, source) => ({
    ...map,
    [source.name]: source,
  }),
  {}
)

type World = Entity[]
type History = string[][]
type Update = [number, string, Entity]

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
  createBehave: (
    position: MutableRefObject<Coordinate>,
    id: string
  ) => (action: Action, steps: number) => void
  replace: Replace
  create: Create
}>(null)

export const useWorld = (width: number, height: number) => {
  const initialWorld = useMemo(() => generateWorld(width, height), [
    height,
    width,
  ])
  const [step, setStep] = useState<number>(null)
  const stepError = useRef<[Error, Entity]>(null)
  const [paused, togglePaused] = useReducer(
    (last, input = null) => (input != null ? input : !last),
    false
  )

  const [{ world, history, ids }, updateWorld] = useReducer(
    (
      state: {
        world: World
        history: History
        ids: Record<string, Entity>
      },
      updates: Update[]
    ) =>
      updates.reduce(
        ({ world, history, ids }, [index, historyEntry, entity]) => {
          const newWorld = [
            ...world.slice(0, index),
            entity,
            ...world.slice(index + 1),
          ]

          return {
            ids: newWorld.reduce(
              (ids, entity) => ({
                ...ids,
                [entity.id]: entity,
              }),
              {}
            ),
            world: newWorld,
            history: [
              ...history.slice(0, step),
              [...(history[step] || []), historyEntry],
              ...history.slice(step + 1),
            ],
          }
        },
        state
      ),
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

  let behaviors: Record<
    string,
    [number, React.MutableRefObject<Coordinate>, Action][]
  > = {}

  let createBehave = (
    positionRef: MutableRefObject<Coordinate>,
    id: string
  ) => {
    delete behaviors[id]

    return (action: Action, steps: number) => {
      behaviors[id] = behaviors[id] || []
      behaviors[id].push([steps, positionRef, action])
    }
  }

  let create: Create = useCallback(
    name => createEntityFromSource(sourcesMap[name]),
    []
  )

  useEffect(() => {
    if (!paused) {
      const interval = setInterval(() => {
        if (paused) return
        const entries = history[step] || []
        if (step !== null) {
          console.groupCollapsed(
            `${stepError.current ? '❌' : '✅'} Step ${step} [${
              entries.length
            } updates]`
          )
          entries.forEach((entry, i) => console.log(entry))

          if (stepError.current) {
            const [error, entity] = stepError.current

            console.log(story`${entity} threw `, error)
          }

          console.groupEnd()
        }

        if (stepError.current) {
          setStep(step)
          return clearInterval(interval)
        }

        step == null ? setStep(0) : setStep(step + 1)

        const { updates } = shuffle(Object.keys(behaviors)).reduce(
          ({ updates, updatedIds }, key) => {
            if (!ids[key] || updatedIds[key]) {
              return { updates, updatedIds }
            }
            const entityBehaviors = behaviors[key]

            entityBehaviors.forEach(([steps, positionRef, action]) => {
              if (step % steps === 0 && !stepError.current) {
                try {
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
                } catch (e) {
                  debugger
                  stepError.current = [e, ids[key]]
                }
              }
            })

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

  return {
    world,
    createBehave,
    replace,
    history,
    create,
    togglePaused,
    paused,
    step: step,
    stepError: stepError.current,
  }
}

export type Coordinate = [number, number]

export const usePosition = (position: Coordinate) => {
  const ref = useRef<Coordinate>()

  ref.current = position

  return ref
}

export const useAction = (
  position: Coordinate,
  state: SquareStates,
  id: string
) => {
  const { createBehave, replace, create } = useContext(WorldContext)
  const positionRef = usePosition(position)

  if (state !== 'entered') {
    return {
      behave: () => {},
      act: () => () => {},
    }
  }

  return {
    behave: createBehave(positionRef, id),
    act: (cb: (context: { replace: Replace; create: Create }) => void) => () =>
      cb({ replace, create }),
  }
}
