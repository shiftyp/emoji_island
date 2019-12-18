import React from 'react'
import fake from 'faker'
import { upcase } from './utils'
import { World, sizes } from './world'

export const Game = () => {
  const nameWorld = () =>
    `${upcase(fake.company.bsAdjective())} ${upcase(
      fake.company.bsNoun()
    )}~~${fake.random.alphaNumeric(3)}`

  const [{ size, key }, setSize] = React.useReducer(
    (_, size) => ({
      size,
      key: nameWorld(),
    }),
    {
      size: 'Small',
      key: nameWorld(),
    }
  )

  const sizeOptions = Object.keys(sizes).map(optionSize => (
    <option key={optionSize} value={optionSize}>
      {optionSize}
    </option>
  ))

  return (
    <World
      name={key.split('~~')[0]}
      key={key}
      size={size}
      restartControl={
        <button className="button" onClick={() => setSize(size)}>
          Restart
        </button>
      }
      sizeControl={
        <select
          className="select"
          value={size}
          onChange={e => {
            const select = e.target as HTMLSelectElement

            setSize(
              select.options[select.selectedIndex].value as keyof typeof sizes
            )
          }}
        >
          {sizeOptions}
        </select>
      }
    />
  )
}
