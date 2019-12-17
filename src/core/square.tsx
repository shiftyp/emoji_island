import React from 'react'
import { Entity, Coordinate } from '../core/logic'

export type SquareProps = {
  title: string
  background?: string
  scale?: number
  position: Coordinate
  transition?: string
  onClick?: () => void
  layer?: number
  fadeIn?: boolean
}

export type PositionProps = {
  position: Coordinate
  self: Entity
  id: string
}

export const Square: React.FunctionComponent<SquareProps> = ({
  title,
  background,
  scale,
  children,
  position,
  onClick,
  fadeIn = true,
  layer = 1,
}) => (
  <button
    key="button"
    className="square-button"
    onClick={onClick}
    style={{
      background: 'transparent',
      border: 'none',
      top: `${position[1] * 3}rem`,
      left: `${position[0] * 3}rem`,
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
        background: `radial-gradient(${background}, rgba(0, 0, 0, 0))`,
        border: `0.2rem solid ${background}`,
        zIndex: layer,
        animationDuration: fadeIn ? '1s' : '0s',
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
