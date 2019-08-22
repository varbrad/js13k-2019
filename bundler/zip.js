const path = require('path')
const fs = require('fs-extra')
const archiver = require('archiver')

const { DIST, ZIP_NAME } = require('./consts')

module.exports = async () =>
  new Promise(resolve => {
    const stream = fs.createWriteStream(path.join(__dirname, ZIP_NAME))
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
