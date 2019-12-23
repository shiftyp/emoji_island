import React from 'react'
import { Island } from './island'

export type GridProps = {
  height: number
  width: number
  scale: number
  left: number
  top: number
  gridRef: React.MutableRefObject<HTMLDivElement>
  style?: React.CSSProperties
}

export const Grid: React.FunctionComponent<GridProps> = React.memo(
  ({ height, width, scale, children, left, top, gridRef, style }) => {
    const gridInnerRef = React.useRef<HTMLDivElement>(null)

    return (
      <div
        className="grid-outer"
        ref={gridRef}
        style={{
          visibility: scale !== null ? 'visible' : 'hidden',
          top: `${top}px`,
          left: `${left}px`,
          transform: scale !== null ? `scale(${scale})` : '',
          ...(style || {}),
        }}
      >
        <div
          key="grid"
          className="grid"
          style={{
            height: `${height * 3}rem`,
            width: `${width * 3}rem`,
          }}
        >
          <div className="grid-inner" key="grid-inner" ref={gridInnerRef}>
            <Island />
            {children}
          </div>
        </div>
      </div>
    )
  }
)
