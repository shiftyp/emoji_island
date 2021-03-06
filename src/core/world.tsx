import React from 'react'
import { TransitionGroup, CSSTransition } from 'react-transition-group'

import { useWorld, WorldContext, Coordinate, sourcesMap } from './logic'
import { Grid } from './grid'
import { SquareBoundary } from './errors'

export const sizes = {
  Small: [5, 5],
  Medium: [10, 10],
  Large: [20, 20],
  Huge: [30, 30],
}

export const World: React.FunctionComponent<{
  size: keyof typeof sizes
  sizeControl: JSX.Element
  onRestart: () => void
  name: string
}> = ({ size, sizeControl, name, onRestart }) => {
  const logRef = React.useRef<HTMLDivElement>(null)
  const headerRef = React.useRef<HTMLDivElement>(null)
  const gridRef = React.useRef<HTMLDivElement>(null)

  const [scale, setScale] = React.useState<number>(null)
  const [showSidebar, toggleSidebar] = React.useReducer<
    (state: Boolean, arg?: boolean) => boolean
  >((last, input = !last) => input, false)

  const resizeHandler = () => {
    if (logRef.current && headerRef.current && gridRef.current) {
      const gridHeight = gridRef.current.offsetWidth
      const gridWidth = gridRef.current.offsetHeight

      if (!gridHeight || !gridWidth) {
        return
      }

      const viewportWidth = window.innerWidth
      const viewportHeight = window.innerHeight - headerRef.current.offsetHeight
      setScale(
        Math.min(viewportWidth / gridHeight, viewportHeight / gridHeight)
      )
    } else {
      setScale(null)
    }
  }

  const [height, width] = sizes[size]

  React.useEffect(() => {
    window.addEventListener('resize', resizeHandler)

    resizeHandler()

    return () => window.removeEventListener('resize', resizeHandler)
  }, [logRef.current, gridRef.current, headerRef.current])

  const {
    ids,
    world,
    createBehave,
    history,
    score,
    replace,
    create,
    togglePaused,
    paused,
    step,
    stepError,
    setStepError,
  } = useWorld(width, height)

  const populations = world.reduce(
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
    <>
      <div className="layout" key="layout">
        <div className="header" ref={headerRef}>
          <h1>
            <div>{sizeControl} Emoji Island:</div>
            <div>
              <button className="button" onClick={() => onRestart()}>
                Restart
              </button>
              <button
                className="button"
                onClick={() => (togglePaused as () => void)()}
              >
                {!paused ? 'Pause' : 'Play'}
              </button>
              <button
                className="button"
                onClick={() => {
                  toggleSidebar()
                }}
              >
                {showSidebar ? 'Hide About' : 'About'}
              </button>
            </div>
          </h1>
        </div>

        <div
          className="log"
          ref={logRef}
          style={{
            display: !showSidebar ? 'none' : undefined,
            top: headerRef.current ? `${headerRef.current.offsetHeight}px` : 0,
          }}
        >
          <h2>Welcome to "{name}" Island!</h2>
          <h3>How to play</h3>
          <p>
            Emoji Island is a world simulation of emoji proportions! What are
            the next steps? It's up to you, your emojis, and your mouse /
            keyboard / touch / assistive device!
          </p>
          <h3>How to edit</h3>
          <p>
            Take your programming skills to the next level and{' '}
            <a
              target="_blank"
              href="https://codesandbox.io/embed/github/shiftyp/emoji_island/tree/master/?expanddevtools=1&fontsize=13&hidenavigation=1&module=%2Fsrc%2Fentities%2Findex.ts"
            >
              edit the code for this game
            </a>{' '}
            or{' '}
            <a href="https://github.com/shiftyp/emoji_island">
              clone the repository
            </a>
            ! Want to learn how to make changes?{' '}
            <a
              target="_blank"
              href="https://dev.to/shiftyp/introducing-emoji-island-2n7d"
            >
              Watch this video
            </a>
            !
          </p>
          <h3>Score</h3>
          <p>The number of times each event has happened in the game</p>
          <ol>
            {Object.keys(score)
              .sort((a, b) => score[a] - score[b])
              .reduce((output, key) => {
                return [
                  <li key={`score-${key}`}>
                    <b>{key}</b>: {score[key]}
                  </li>,
                  ...output,
                ]
              }, [])}
          </ol>
          <h3>Populations</h3>
          <p>The number of entities currently in the game</p>
          <dl className="scores">
            {Object.keys(sourcesMap)
              .sort(
                (a, b) =>
                  ((populations[b] && populations[b].count) || 0) -
                  ((populations[a] && populations[a].count) || 0)
              )
              .map((name, i) => {
                if (name === 'None') return null

                const avgEnergy = populations[name]
                  ? Math.floor(
                      (populations[name].energy / populations[name].count) * 100
                    ) / 100
                  : 0
                const count = populations[name] ? populations[name].count : 0
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
          <p>
            The record of changes to the game. ❌ indicates an error in the game{' '}
            <b>
              {stepError
                ? `An error occured, restart or open developer console for more details`
                : `(open developer console for updates)`}
            </b>
          </p>
          <ul>
            {history.slice(-4).reduce((output, entries, index) => {
              const localStep = step - Math.min(history.length - 1, 3) + index

              return [
                <li key={`history-${localStep}`}>
                  <span role="img" aria-label="checkmark">
                    {stepError && localStep === step ? '❌' : '✅'}
                  </span>
                  Step {localStep} [{entries.length} updates]
                </li>,
                ...output,
              ]
            }, [])}
          </ul>
        </div>
      </div>
      <WorldContext.Provider
        key="provider"
        value={{ createBehave, replace, create, ids, setStepError }}
      >
        <Grid
          key={name}
          gridRef={gridRef}
          style={{
            filter: showSidebar ? 'blur(0.5em)' : undefined,
            visibility: scale !== null ? 'visible' : 'hidden',
          }}
          top={headerRef.current && headerRef.current.offsetHeight}
          left={0}
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
    </>
  )
}
