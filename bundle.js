const fs = require('fs-extra')
const path = require('path')

const prettyBytes = require('pretty-bytes')
const terser = require('terser')
const ora = require('ora')
const chalk = require('chalk')

const DIST = path.join(__dirname, '/dist')
const BUNDLE = path.join(DIST, 'bundle.js')

const log = ora({ text: 'Bundling' }).start()

const bundle = async () => {
  const code = 'const a = 123; const f = () => a; console.log(f());'
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

  await fs.emptyDir(DIST)
  await fs.writeFile(BUNDLE, crunchedCode)

  const finalFileSize = prettyBytes((await fs.stat(BUNDLE)).size)

  log.succeed(
    chalk.green('Finished!') +
      '\n\n' +
      chalk.yellow(`Final bundle size = ${finalFileSize}`),
  )
}

bundle()
