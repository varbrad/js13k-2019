import makeCanvas from './js/canvas'
import { renderBg, updateBg } from './js/bg'
import { gameWidth, gameHeight, CLEAR_COLOUR } from './js/consts'
import StartScreen from './js/scenes/start'

/** @type {CanvasRenderingContext2D} */
const ctx = makeCanvas('game', gameWidth, gameHeight)
const bgCtx = makeCanvas('bg', gameWidth, gameHeight)

ctx.font = 'italic bold 22px monospace'

export const state = {
  screen: new StartScreen(),
}

const render = () => {
  renderBg(bgCtx)

  ctx.fillStyle = CLEAR_COLOUR
  ctx.fillRect(0, 0, gameWidth, gameHeight)
}

const update = () => {
  // Update things
  updateBg()
  if (state.screen) state.screen.update()

  // Render
  render()
  if (state.screen) state.screen.render(ctx)
  requestAnimationFrame(update)
}

update()
