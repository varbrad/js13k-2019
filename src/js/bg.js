import { gameWidth, gameHeight, COLOURS } from './consts'
import { rand, randDelta, wrap, pick } from './utils'

const balls = [...Array(200).keys()].map(() => {
  const [dx, dy] = randDelta()
  return {
    r: rand(1, 4),
    x: rand(0, gameWidth),
    y: rand(0, gameHeight),
    dx: (dx * Math.random()) / rand(18, 38),
    dy: (dy * Math.random()) / rand(18, 38),
    colour: pick(COLOURS),
  }
})

export const updateBg = () => {
  balls.forEach(ball => {
    ball.x = wrap(ball.x + ball.dx, -ball.r, gameWidth + ball.r)
    ball.y = wrap(ball.y + ball.dy, -ball.r, gameHeight + ball.r)
  })
}

/**
 * @param {CanvasRenderingContext2D} bgCtx
 */
export const renderBg = bgCtx => {
  bgCtx.fillStyle = 'rgba(17, 173, 193, .001)'
  bgCtx.fillRect(0, 0, gameWidth, gameHeight)

  balls.forEach(ball => {
    bgCtx.fillStyle = ball.colour
    bgCtx.beginPath()
    bgCtx.arc(ball.x, ball.y, ball.r, 0, Math.PI * 2)
    bgCtx.fill()
  })

  bgCtx.fillStyle = 'rgba(0, 0, 0, .5)'
  bgCtx.fillRect(0, 0, gameWidth, gameHeight)
}
