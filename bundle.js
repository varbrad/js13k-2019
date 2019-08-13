const fs = require('fs-extra')
const path = require('path')
const du = require('du')
const gzip = require('gzip-size')

const Parcel = require('parcel-bundler')
const prettyBytes = require('pretty-bytes')
const terser = require('terser')
const ora = require('ora')
const chalk = require('chalk')

const ENTRYPOINT = path.join(__dirname, '/src/index.html')
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
  const bundler = new Parcel(ENTRYPOINT, {
    outDir: DIST,
    outFile: 'index.html',
    watch: false,
    minify: true,
    detailedReport: false,
    logLevel: 0,
    contentHash: false,
    scopeHoist: true,
  })
  const bundleData = await bundler.bundle()

  /**
   * Read the code that Parcel output
   */
  const bundledJsPath = Array.from(bundleData.childBundles.values()).find(
    bundle => bundle.type === 'js',
  ).name
  const code = await fs.readFile(bundledJsPath)

  /**
   * Do some terser magic
   */
  const options = {
    toplevel: true,
    compress: { passes: 10, unsafe: true, pure_getters: true },
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
   * Get the Total & JS file size
   */
  const finalFolderSize = prettyBytes(await du(DIST))
  const finalFileSize = prettyBytes((await fs.stat(bundledJsPath)).size)

  const finalFileGzipSize = prettyBytes(await gzip.file(bundledJsPath))

  log
    .succeed(chalk.green('Finished!'))
    .info(chalk.magenta('Dist Size: ') + chalk.yellow(finalFolderSize))
    .info(
      chalk.magenta('JS Size: ') +
        chalk.yellow(`${finalFileSize} (${finalFileGzipSize} gzipped)`),
    )
}

bundle()
