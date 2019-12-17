import React from 'react'
import { TransitionGroup, CSSTransition } from 'react-transition-group'

import { useWorld, WorldContext, Coordinate } from './logic'
import { Grid } from './grid'
import { SquareBoundary } from './errors'
import { sourcesMap } from '../entities'

export const sizes = {
  Small: [5, 5],
  Medium: [10, 10],
  Large: [15, 20],
  Huge: [20, 30],
}

export const World: React.FunctionComponent<{
  size: keyof typeof sizes
  sizeControl: JSX.Element
  restartControl: JSX.Element
  name: string
}> = ({ size, sizeControl, name, restartControl }) => {
  const logRef = React.useRef<HTMLDivElement>(null)
  const headerRef = React.useRef<HTMLDivElement>(null)
  const gridRef = React.useRef<HTMLDivElement>(null)

  const [scale, setScale] = React.useState<number>(null)

  const [height, width] = sizes[size]

  React.useEffect(() => {
    const resizeHandler = () => {
      if (logRef.current && headerRef.current && gridRef.current) {
        const viewportWidth = window.innerWidth - logRef.current.offsetWidth

        const viewportHeight =
          window.innerHeight - headerRef.current.offsetHeight

        setScale(
          Math.min(
            viewportWidth / (gridRef.current.offsetWidth * 1.5),
            viewportHeight / (gridRef.current.offsetHeight * 1.5)
          )
        )
      }
    }

    window.addEventListener('resize', resizeHandler)

    resizeHandler()

    return () => window.removeEventListener('resize', resizeHandler)
  }, [logRef])

  const {
    world,
    createBehave,
    history,
    replace,
    create,
    togglePaused,
    paused,
  } = useWorld(width, height)

  const scores = world.reduce(
    (scores, { name, energy }) => ({
      ...scores,
      [name]: {
        count: scores[name] ? scores[name].count + 1 : 1,
        energy: scores[name] ? scores[name].energy + energy : energy,
      },
    }),
    {} as Record<string, { count: number; energy: number }>
  )

  return (
    <div className="layout" key="layout">
      <div className="header" ref={headerRef}>
        <h1>
          {sizeControl} Emoji Island: {restartControl}
          <button className="button" onClick={() => togglePaused()}>
            {!paused ? 'Pause' : 'Play'}
          </button>
        </h1>
      </div>
      <div className="log" ref={logRef}>
        <h2>Welcome to {name} Island!</h2>
        <p>
          An environmental survival game of emoji proportions! What are the next
          steps for your emoji island? It's up to you, your emojis, and your
          mouse or keyboard!
        </p>
        <h3>Populations</h3>
        <dl className="scores">
          {Object.keys(sourcesMap)
            .sort(
              (a, b) =>
                ((scores[b] && scores[b].count) || 0) -
                ((scores[a] && scores[a].count) || 0)
            )
            .map((name, i) => {
              const avgEnergy = scores[name]
                ? Math.floor((scores[name].energy / scores[name].count) * 100) /
                  100
                : 0
              const count = scores[name] ? scores[name].count : 0
              return (
                <li key={name}>
                  {count !== 0 ? (
                    <b>
                      {i + 1}: {name}
                    </b>
                  ) : (
                    <s>{name}</s>
                  )}
                  {count !== 0 && <dd>count: {count}</dd>}
                  {avgEnergy !== 0 && <dd>avg energy: {avgEnergy}</dd>}
                </li>
              )
            })}
        </dl>
        <h3>Log:</h3>
        <p>(open developer console for updates)</p>
        <ul>
          {history.slice(-4).reduce((output, count, index) => {
            const step = history.length - Math.min(history.length, 4) + index

            return [
              <li key={`history-${step}`}>
                <span role="img" aria-label="checkmark">
                  ✅
                </span>
                Step {step} [{count} updates]
              </li>,
              ...output,
            ]
          }, [])}
        </ul>
      </div>
      <WorldContext.Provider
        key="provider"
        value={{ createBehave, replace, create }}
      >
        <Grid
          key={name}
          gridRef={gridRef}
          top={headerRef.current && headerRef.current.offsetHeight}
          left={logRef.current && logRef.current.offsetWidth}
          height={height}
          width={width}
          scale={scale}
        >
          <TransitionGroup key={`${name}-group`} component={null}>
            {world.map((entity, index) => {
              const { name, id, component: Component, animate } = entity
              const x = index % width
              const y = Math.floor(index / width)
              const position: Coordinate = [x, y]

              return (
                <CSSTransition
                  unmountOnExit
                  key={`${name}-${id}-transition`}
                  classNames="square"
                  timeout={
                    animate
                      ? {
                          enter: 500,
                          exit: 1000,
                        }
                      : 0
                  }
                >
                  {state => (
                    <SquareBoundary
                      key={`${name}-${id}-boundary`}
                      position={position}
                      entity={entity}
                    >
                      <Component
                        key={`${name}-${id}-square`}
                        id={id}
                        self={entity}
                        position={position}
                        state={state}
                      />
                    </SquareBoundary>
                  )}
                </CSSTransition>
              )
            })}
          </TransitionGroup>
        </Grid>
      </WorldContext.Provider>
    </div>
  )
}
