import makeCanvas from './js/canvas'
import {
  gameWidth,
  gameHeight,
  SCALE,
  DEG90,
  DEG180,
  DEG270,
} from './js/consts'
import { fill, render } from './js/render'
import { pip } from './js/sprites/basic'
import { renderGame, updateGame } from './js/game'

/** @type {CanvasRenderingContext2D} */
const ctx = makeCanvas('game', gameWidth, gameHeight, SCALE)

ctx.font = 'italic bold 22px monospace'

const mainRender = () => {
  ctx.save()
  ctx.scale(SCALE, SCALE)
  fill(ctx)
  // Render the game
  renderGame(ctx)
  // Top left pip
  render(ctx, pip, 3, 3)
  // Top right pip
  render(ctx, pip, gameWidth - 3, 3, DEG90)
  // Bottom right pip
  render(ctx, pip, gameWidth - 3, gameHeight - 3, DEG180)
  // Bottom left pip
  render(ctx, pip, 3, gameHeight - 3, DEG270)
  ctx.restore()
}

const update = () => {
  // Update
  updateGame()
  // Render
  mainRender()
  requestAnimationFrame(update)
}

update()
