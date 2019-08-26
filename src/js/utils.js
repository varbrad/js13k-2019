export const rand = (min, max) =>
  Math.floor(Math.random() * (max - min + 1)) + min

export const pick = arr => arr[rand(0, arr.length - 1)]

export const randAngle = () => rand(0, Math.PI * 2)

export const randDelta = () => {
  const angle = randAngle()
  return [Math.cos(angle), Math.sin(angle)]
}
