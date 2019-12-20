import React from 'react'

export type GridProps = {
  height: number
  width: number
  scale: number
  left: number
  top: number
  gridRef: React.MutableRefObject<HTMLDivElement>
  gridOuterRef: React.MutableRefObject<HTMLDivElement>
  style?: React.CSSProperties
}

export const Grid: React.FunctionComponent<GridProps> = React.memo(
  ({ height, width, scale, children, left, top, gridRef, style }) => (
    <div
      className="grid-outer"
      ref={gridRef}
      style={{
        position: 'absolute',
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
        <div className="grid-inner" key="grid-inner">
          {children}
        </div>
      </div>
    </div>
  )
)
