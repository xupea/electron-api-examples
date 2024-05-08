const fs = require('fs')
const path = require('path')

function copy(src, dest) {
  const stat = fs.statSync(src)
  if (stat.isDirectory()) {
    fs.mkdirSync(dest, { recursive: true })
    for (const file of fs.readdirSync(src)) {
      const srcFile = path.resolve(src, file)
      const destFile = path.resolve(dest, file)
      copy(srcFile, destFile)
    }
  } else {
    fs.copyFileSync(src, dest)
  }
}

exports.copy = (src, dest) => {
  if (fs.existsSync(src)) copy(src, dest)
}

function emptyDir(dir) {
  for (const file of fs.readdirSync(dir)) {
    const abs = path.resolve(dir, file)
    if (fs.lstatSync(abs).isDirectory()) {
      emptyDir(abs)
      fs.rmdirSync(abs)
    } else {
      fs.unlinkSync(abs)
    }
  }
}

exports.emptyDir = (path) => {
  if (fs.existsSync(path)) emptyDir(path)
}
