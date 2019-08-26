import { gameWidth, gameHeight, WHITE, BLACK, PURPLE, PINK } from './consts'

/** @param {CanvasRenderingContext2D} ctx */
export const fill = ctx => rect(ctx, 0, 0, gameWidth, gameHeight, WHITE)

export const rect = (ctx, x, y, w, h, colorCode) => {
  if (colorCode) ctx.fillStyle = getColor(colorCode)
  ctx.fillRect(x, y, w, h)
}

export const getColor = colorCode => {
  switch (colorCode) {
    case BLACK:
      return 'rgb(10, 9, 18)'
    case PURPLE:
      return 'rgb(112, 87, 156)'
    case PINK:
      return 'rgb(224, 150, 168)'
    case WHITE:
      return 'rgb(255, 241, 235)'
    default:
      return null
  }
}

export const render = (ctx, item, x, y, angle, scale = 1) => {
  ctx.save()
  const [w, h] = [item[0].length, item.length]
  ctx.translate(x, y)
  ctx.rotate(angle)
  ctx.scale(scale, scale)
  for (let _y = 0; _y < h; ++_y) {
    for (let _x = 0; _x < w; ++_x) {
      const color = item[_y][_x]
      if (!color) continue
      rect(ctx, _x - w / 2, _y - h / 2, 1, 1, item[_y][_x])
    }
  }
  ctx.restore()
}
