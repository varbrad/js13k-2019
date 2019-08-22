const rollup = require('rollup')

const sizeOf = require('./sizeOf')
const { JS_INPUT } = require('./consts')

/**
 * Uses rollup to produce an IIFE of the entire JS bundle
 */
module.exports = async () => {
  // Invoke the bundler
  const bundle = await rollup.rollup({
    input: JS_INPUT,
  })
  // Generate our final code
  const {
    output: [{ code }],
  } = await bundle.generate({
    name: 'bundle.js',
    format: 'iife',
    compact: true,
    strict: false,
  })
  // Get our first chunks code (We should only have 1 chunk)
  return [code, sizeOf(code)]
}
