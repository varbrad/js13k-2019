export default (name, width, height, scale = 1) => {
  const canvas = document.getElementById(name)
  canvas.width = width * scale
  canvas.height = height * scale
  return canvas.getContext('2d')
}
