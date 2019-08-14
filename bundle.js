const path = require('path')
const fs = require('fs-extra')
const rollup = require('rollup')
const terser = require('terser')
const archiver = require('archiver')
const ora = require('ora')
const chalk = require('chalk')
const bytes = require('pretty-bytes')
const ParcelBundler = require('parcel-bundler')

const HTML_INPUT = 'src/index.html'
const JS_INPUT = 'src/index.js'
const DIST = 'dist'
const HTML_OUTPUT = 'dist/index.html'
const JS_OUTPUT = 'dist/bundle.js'

const MAX_SIZE = 13 * 1024 // 13KB

const sizeOf = string => Buffer.byteLength(string, 'utf8')

/**
 * Uses Parcel to bundle our HTML & CSS
 */
const bundleHTML = async () => {
  const options = {
    outDir: DIST,
    watch: false,
    contentHash: false,
    minify: true,
    scopeHoist: true,
    target: 'browser',
    logLevel: 0,
    sourceMaps: false,
  }

  const bundler = new ParcelBundler(HTML_INPUT, options)
  const bundle = await bundler.bundle()

  const { name } = Array.from(bundle.childBundles).find(
    bundle => bundle.type === 'js',
  )

  const [, sourceName] = /.+\\(.+?.js)$/.exec(name)

  const htmlSource = await fs.readFile(HTML_OUTPUT, 'utf8')
  await fs.writeFile(HTML_OUTPUT, htmlSource.replace(sourceName, 'bundle.js'))
  await fs.remove(name)
}

/**
 * Uses rollup to produce an IIFE of the entire JS bundle
 */
const bundleJS = async () => {
  // Invoke the bundler
  const bundle = await rollup.rollup({
    input: JS_INPUT,
  })
  // Generate our final code
  const {
    output: [{ code }],
  } = await bundle.generate({
    format: 'iife',
    compact: true,
    strict: false,
  })
  // Get our first chunks code (We should only have 1 chunk)
  return [code, sizeOf(code)]
}

const minify = async bundledCode => {
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
  return [code, sizeOf(code)]
}

const zip = async () =>
  new Promise(resolve => {
    const stream = fs.createWriteStream(path.join(__dirname, 'js13k.zip'))
    const archive = archiver('zip', {
      zlib: { level: 9 },
    })

    stream.on('close', () => {
      resolve(archive.pointer())
    })

    archive.pipe(stream)
    archive.directory(DIST)
    archive.finalize()
  })

const run = async () => {
  const log = ora(chalk.yellow('Cleaning output folder...'))

  await fs.emptyDir(DIST)

  log.text = chalk.yellow('Bundling HTML & CSS...')

  /**
   * Bundling of our HTML & CSS
   */
  await bundleHTML()

  log.text = chalk.yellow('Bundling JS...')

  /**
   * Bundling & minifcation of JS
   */
  const [code, bundleSize] = await bundleJS()
  const [minifiedCode, minifiedSize] = await minify(code)

  log.succeed(chalk.cyan('Bundling & minification completed!'))
  log.text = chalk.yellow('Writing bundle to disk...')

  /**
   * Writing to our dist folder
   */
  await fs.writeFile(JS_OUTPUT, minifiedCode)

  log.succeed(chalk.cyan('Bundle written to disk!'))
  log.text = chalk.yellow('Zipping up bundles...')

  /**
   * Produce a ZIP archive of our dist folder
   */
  const zipSize = await zip()

  log.succeed(chalk.cyan('Zip file generated!'))

  log.succeed(chalk.green('All done!'))

  log.info(chalk.yellow(`Original JS: ${bytes(bundleSize)}`))
  log.info(chalk.yellow(`Bundled JS: ${bytes(minifiedSize)}`))

  const percent = ((zipSize / MAX_SIZE) * 100).toFixed(2)
  log.info(
    chalk.magenta(
      `Zip Size: ${bytes(zipSize)} / ${bytes(MAX_SIZE)} (${percent}%)`,
    ),
  )
}

run()
