export default (name, width, height) => {
  const canvas = document.getElementById(name)
  canvas.width = width
  canvas.height = height
  return canvas.getContext('2d')
}
