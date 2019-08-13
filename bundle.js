const fs = require('fs-extra')
const path = require('path')

const Parcel = require('parcel-bundler')
const prettyBytes = require('pretty-bytes')
const terser = require('terser')
const ora = require('ora')
const chalk = require('chalk')

const ENTRYPOINT = path.join(__dirname, '/src/index.js')
const DIST = path.join(__dirname, '/dist')

const BUNDLE = 'bundle.js'
const BUNDLE_MIN = 'bundle.min.js'

const log = ora({ text: 'Bundling' }).start()

const bundle = async () => {
  /**
   * Nuke old dist folder
   */
  await fs.emptyDir(DIST)

  /**
   * Parcel sources
   */
  const bundler = new Parcel(ENTRYPOINT, {
    outDir: DIST,
    outFile: BUNDLE,
    watch: false,
    minify: true,
    detailedReport: false,
    logLevel: 0,
    scopeHoist: true,
  })
  await bundler.bundle()

  /**
   * Begin the terser step
   */
  const options = {
    toplevel: true,
    compress: { passes: 10, unsafe: true, pure_getters: true },
  }

  /**
   * Read the code that Parcel output
   */
  const code = await fs.readFile(path.join(DIST, BUNDLE))

  /**
   * Do some terser magic
   */
  const minified = terser.minify(`onload = function(){${code}}`, options)
  const crunchedCode =
    minified.code.length > 21
      ? minified.code
          .slice(0, -1)
          .replace(/-- >/g, '-->')
          .replace(/onload=function\(\){(var )?(.*)}/, '$2')
      : ''

  /**
   * Write the terser code to our min bundle
   */
  await fs.writeFile(path.join(DIST, BUNDLE_MIN), crunchedCode)

  /**
   * Get that file size
   */
  const finalFileSize = prettyBytes(
    (await fs.stat(path.join(DIST, BUNDLE_MIN))).size,
  )

  log.succeed(
    chalk.green('Finished!') +
      '\n\n' +
      chalk.yellow(`Final bundle size = ${finalFileSize}`),
  )
}

bundle()
