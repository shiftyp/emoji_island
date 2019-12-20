import React from 'react'
import { TransitionGroup, CSSTransition } from 'react-transition-group'

import { useWorld, WorldContext, Coordinate, sourcesMap } from './logic'
import { Grid } from './grid'
import { SquareBoundary } from './errors'

export const sizes = {
  Small: [5, 5],
  Medium: [10, 10],
  Large: [15, 20],
  Huge: [20, 30],
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
  const gridOuterRef = React.useRef<HTMLDivElement>(null)

  const initialMenu = React.useMemo(() => window.innerWidth < 1000, [])
  const [scale, setScale] = React.useState<number>(null)
  const [showMenu, setMenu] = React.useState<boolean>(initialMenu)
  const [showSidebar, toggleSidebar] = React.useReducer<
    (state: Boolean, arg?: boolean) => boolean
  >((last, input = null) => (input != null ? input : !last), true)

  const resizeHandler = () => {
    if (logRef.current && headerRef.current && gridRef.current) {
      if (window.innerWidth > 1000 && window.devicePixelRatio <= 2) {
        const viewportWidth = window.innerWidth - logRef.current.offsetWidth
        const viewportHeight =
          window.innerHeight - headerRef.current.offsetHeight

        setScale(
          Math.min(
            viewportWidth / gridRef.current.offsetWidth,
            viewportHeight / gridRef.current.offsetHeight
          )
        )
        toggleSidebar(true)
        setMenu(false)
      } else {
        const viewportWidth = window.innerWidth
        const viewportHeight =
          window.innerHeight - headerRef.current.offsetHeight

        setScale(
          Math.min(
            viewportWidth / gridRef.current.offsetWidth,
            viewportHeight / gridRef.current.offsetHeight
          )
        )
        toggleSidebar(false)
        setMenu(true)
      }
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
    replace,
    create,
    togglePaused,
    paused,
    step,
    stepError,
    setStepError,
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
    <>
      <div className="layout" key="layout">
        <div className="header" ref={headerRef}>
          <h1>
            {sizeControl} Emoji Island:{' '}
            <button className="button" onClick={() => onRestart()}>
              Restart
            </button>
            <button
              className="button"
              onClick={() => (togglePaused as () => void)()}
            >
              {!paused ? 'Pause' : 'Play'}
            </button>
            {showMenu && (
              <button
                className="button"
                onClick={() => {
                  togglePaused(true)
                  toggleSidebar()
                }}
              >
                {showSidebar ? 'World' : 'Help'}
              </button>
            )}
          </h1>
        </div>

        <div
          className="log"
          ref={logRef}
          style={{
            display: showMenu && !showSidebar ? 'none' : undefined,
            top: headerRef.current ? `${headerRef.current.offsetHeight}px` : 0,
          }}
        >
          <h2>Welcome to "{name}" Island!</h2>
          <p>
            A world simulation of emoji proportions! What are the next steps for
            your emoji island? It's up to you, your emojis, and your mouse or
            keyboard! Or take it to the next level and{' '}
            <a
              target="_blank"
              href="https://codesandbox.io/embed/github/shiftyp/emoji_island/tree/master/?expanddevtools=1&fontsize=13&hidenavigation=1&module=%2Fsrc%2Fentities%2Findex.ts"
            >
              edit the code for this game
            </a>
            ! Want to learn how?{' '}
            <a
              target="_blank"
              href="https://dev.to/shiftyp/introducing-emoji-island-2n7d"
            >
              Watch this video
            </a>
            !
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
                  ? Math.floor(
                      (scores[name].energy / scores[name].count) * 100
                    ) / 100
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
          <p>
            {stepError
              ? `An error occured, restart or open developer console for more details`
              : `(open developer console for updates)`}
          </p>
          <ul>
            {history.slice(-4).reduce((output, entries, index) => {
              const localStep = step - Math.min(history.length, 4) + index + 1

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
            display: showSidebar && showMenu ? 'none' : undefined,
            visibility: scale !== null ? 'visible' : 'hidden',
          }}
          top={headerRef.current && headerRef.current.offsetHeight}
          left={
            showSidebar && !showMenu && logRef.current
              ? logRef.current.offsetWidth
              : 0
          }
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
