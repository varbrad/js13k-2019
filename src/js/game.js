import { render } from './render'
import { ship } from './sprites/ship'

export const updateGame = () => {}

let n = 0
export const renderGame = ctx => {
  render(ctx, ship, 40, 20, n)
  n += 0.01
}
