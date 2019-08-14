const fs = require('fs-extra')
const path = require('path')
const du = require('du')
const gzip = require('gzip-size')

const Parcel = require('parcel-bundler')
const prettyBytes = require('pretty-bytes')
const terser = require('terser')
const ora = require('ora')
const chalk = require('chalk')

const JS_ENTRY = path.join(__dirname, '/src/index.js')
const DIST = path.join(__dirname, '/dist')

const log = ora({ text: 'Bundling' }).start()

const bundle = async () => {
  /**
   * Nuke old dist folder
   */
  await fs.emptyDir(DIST)

  /**
   * Parcel sources
   */
  const bundler = new Parcel([JS_ENTRY], {
    outDir: DIST,
    watch: false,
    minify: true,
    detailedReport: false,
    logLevel: 0,
    contentHash: false,
    scopeHoist: true,
  })
  await bundler.bundle()

  /**
   * Read the code that Parcel output
   */
  const bundledJsPath = path.join(DIST, 'index.js')

  const parcelFileSize = prettyBytes((await fs.stat(bundledJsPath)).size)
  const code = await fs.readFile(bundledJsPath)

  /**
   * Do some terser magic
   */
  const options = {
    toplevel: true,
    mangle: true,
    compress: {
      passes: 10,
      unsafe: true,
      unsafe_undefined: true,
      unsafe_proto: true,
      unsafe_methods: true,
      unsafe_math: true,
      unsafe_Function: true,
      unsafe_comps: true,
      unsafe_arrows: true,
      pure_getters: true,
    },
  }

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
  await fs.writeFile(bundledJsPath, crunchedCode)

  /**
   * Get the Total, HTML & JS file size
   */
  const finalFolderSize = prettyBytes(await du(DIST))

  log
    .succeed(chalk.green('Bundling Finished'))
    .info(chalk.cyan('Parcel JS Size: ') + chalk.red(parcelFileSize))
    .succeed(chalk.green('Finished Optimizing!'))
    .info(`Size: ${finalFolderSize}`)
}

bundle()
