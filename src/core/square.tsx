import React from 'react'
import { Entity, Coordinate, SquareStates } from '../core/logic'

export type SquareProps = {
  title: string
  background?: string
  scale?: number
  position: Coordinate
  transition?: string
  onClick?: () => void
  layer?: number
  animate?: boolean
  className?: string
}

export type PositionProps = {
  position: Coordinate
  self: Entity
  id: string
  className?: string
  state: SquareStates
}

export const Square: React.FunctionComponent<SquareProps> = ({
  title,
  background,
  scale,
  children,
  position,
  onClick,
  className,
  animate = true,
  layer = 1,
}) => (
  <button
    key="button"
    className="square-button"
    onClick={onClick}
    style={{
      top: `${position[1] * 3}rem`,
      left: `${position[0] * 3}rem`,
      border: `0.2rem solid ${background}`,
      background: `radial-gradient(${background}, rgba(0, 0, 0, 0))`,
    }}
    title={title}
  >
    <span
      key="emoji"
      className="square"
      role="img"
      aria-label={title}
      style={{
        fontSize: `${scale}rem`,
        zIndex: layer,
      }}
    >
      {children}
    </span>
  </button>
)

Square.defaultProps = {
  background: 'transparent',
  scale: 1,
}
