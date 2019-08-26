const fs = require('fs-extra')
const ParcelBundler = require('parcel-bundler')
const { DIST, HTML_INPUT, HTML_OUTPUT } = require('./consts')

/**
 * Uses Parcel to bundle our HTML & CSS
 */
module.exports = async () => {
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
