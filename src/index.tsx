import React from 'react'
import { render } from 'react-dom'

import './main.css'

import { Game } from './core/game'

render(<Game key="game" />, document.getElementById('app'))
