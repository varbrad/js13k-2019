const regpack = require('regpack')

module.exports = async code => {
  const options = {
    withMath: false,
    hash2DContext: true,
    hashWebGLContext: true,
    hashAudioContext: true,
    contextconstiableName: 'c',
    contextType: 0,
    reassignconsts: true,
    varsNotReassigned: 'a b c',
    crushGainFactor: 1,
    crushLengthFactor: 0,
    crushCopiesFactor: 0,
    crushTiebreakerFactor: 1,
    wrapInSetInterval: false,
    timeconstiableName: '',
    useES6: true,
  }
  const cleanedCode = code.replace(/([\r\n]|^)\s*\/\/.*|[\r\n]+\s*/g, '')
  const inputList = regpack.packer.runPacker(cleanedCode, options)

  const methodCount = inputList.length

  let bestMethod = 0
  let bestCompression = 1e8
  let bestStage = 0
  for (let i = 0; i < methodCount; ++i) {
    const packerData = inputList[i]
    for (let j = 0; j < 4; ++j) {
      const output = j == 0 ? packerData.contents : packerData.result[j - 1][1]
      const packedLength = regpack.packer.getByteLength(output)
      if (packedLength > 0 && packedLength < bestCompression) {
        bestCompression = packedLength
        bestMethod = i
        bestStage = j
      }
    }
  }

  return inputList[bestMethod].result[bestStage][1]
}
