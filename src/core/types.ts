import { PositionProps } from './square'

export type Entity = Readonly<{
  name: string
  id: string
  component: React.FunctionComponent<PositionProps>
  energy: number
  animate: boolean
}>

export type SourceEntity = Readonly<{
  name: string
  probability: number
  component: React.FunctionComponent
  makeId: () => string
  startingEnergy: number
  animate: boolean
}>
