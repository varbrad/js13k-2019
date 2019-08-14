const makeCanvas = () => {
  const canvas = document.getElementById('canvas')
  const ctx = canvas.getContext('2d')
  return ctx
}

export default makeCanvas
