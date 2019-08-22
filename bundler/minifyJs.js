const terser = require('terser')
const regpack = require('./regpack')
const sizeOf = require('./sizeOf')

module.exports = async bundledCode => {
  const options = {
    toplevel: true,
    mangle: true,
    compress: {
      passes: 10,
      unsafe: true,
      pure_getters: true,
    },
  }

  const { code } = terser.minify(bundledCode, options)

  const packedCode = await regpack(code)

  const [terserSize, packedSize] = [sizeOf(code), sizeOf(packedCode)]

  if (terserSize <= packedSize) {
    return [code, terserSize]
  } else {
    return [packedCode, packedSize]
  }
}
