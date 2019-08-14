export default (width, height) => {
  const canvas = document.getElementById('canvas')
  canvas.width = width
  canvas.height = height
  return canvas.getContext('2d')
}
