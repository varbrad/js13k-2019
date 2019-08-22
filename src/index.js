import makeCanvas from './js/canvas'

const [width, height] = [window.innerWidth, window.innerHeight]

/** @type {CanvasRenderingContext2D} */
const ctx = makeCanvas(width, height)

const fs = style => (ctx.fillStyle = style)
const fr = (...args) => ctx.fillRect(...args)

let x = 0
let y = 0

const update = () => {
  x += 1
  y += 2

  if (x > width) x = 0
  if (y > height) y = 0

  fs('red')
  fr(0, 0, width, height)

  ctx.save()
  ctx.translate(x, y)
  ctx.rotate(x / 10)
  fs('black')
  fr(-20, -20, 40, 40)
  ctx.restore()

  for (let i = 0; i < 20; ++i) {
    console.log(i)
    console.log(i * 2)
  }

  requestAnimationFrame(update)
}

update()
