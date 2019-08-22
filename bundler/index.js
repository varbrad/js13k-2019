const fs = require('fs-extra')
const ora = require('ora')
const chalk = require('chalk')
const bytes = require('pretty-bytes')

const bundleHTML = require('./html')
const bundleJS = require('./js')
const minify = require('./minifyJs')
const zip = require('./zip')

const { DIST, JS_OUTPUT, MAX_SIZE } = require('./consts')

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
