import React from 'react'
import { Square } from './square'
import { Coordinate } from './logic'
import { story } from './utils'
import { Entity } from './types'

const BadSquare: React.FunctionComponent<{
  position: Coordinate
  title: string
}> = ({ position, title }) => (
  <Square title={title} position={position} background={'rgba(255, 0, 0, 0.5)'}>
    ❌
  </Square>
)

export class SquareBoundary extends React.Component<
  { position: Coordinate; entity: Entity },
  { error: any }
> {
  constructor(props) {
    super(props)
    this.state = {
      error: null,
    }
  }

  componentDidCatch(error: Error) {
    console.log(error.message)
  }

  static getDerivedStateFromError(error) {
    return { error }
  }
  render() {
    if (this.state.error) {
      return (
        <BadSquare
          title={story`${
            this.props.entity
          } threw ${this.state.error.toString()}`}
          position={this.props.position}
        />
      )
    }

    return this.props.children
  }
}
