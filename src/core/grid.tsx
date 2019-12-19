import React from 'react'

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
  ({ height, width, scale, children, left, top, gridRef, style }) => (
    <div
      key="grid"
      ref={gridRef}
      className="grid"
      style={{
        position: 'absolute',
        top: `${top}px`,
        left: `${left}px`,
        height: `${height * 3}rem`,
        width: `${width * 3}rem`,
        transform: scale !== null ? `scale(${scale}) translate(25%, 25%)` : '',
        ...(style || {}),
      }}
    >
      <div className="grid-inner" key="grid-inner">
        {children}
      </div>
    </div>
  )
)
