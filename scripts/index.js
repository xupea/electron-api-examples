// const minimist = require('minimist')
const path = require('path')
const fs = require('fs')
const { execSync } = require('child_process')
const prompts = require('prompts')
const { copy, emptyDir } = require('./utils/fsExtra')

function getExamples() {
  const files = fs.readdirSync(path.resolve('examples'))
  return files.map((dir) => ({
    title: dir
      .split('-')
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' '),
    value: dir
  }))
}

function cloneExample(example) {
  const templateRoot = path.resolve('examples')
  const root = path.resolve('src')
  const templateDir = path.resolve(templateRoot, example)
  emptyDir(root)
  copy(templateDir, root)
}

function runExample() {
  const options = {
    stdio: 'inherit',
    cwd: path.join(__dirname, '../')
  }

  try {
    return execSync(`npm run dev`, options).toString()
  } catch (e) {
    return null
  }
}

async function init() {
  let result = {}

  try {
    const examples = getExamples()

    result = await prompts({
      type: 'select',
      name: 'value',
      message: 'Pick an example',
      choices: examples,
      initial: 0
    })
  } catch (cancelled) {
    console.log(cancelled.message)
    return
  }

  const { value } = result
  cloneExample(value)

  runExample()
}

init().catch((e) => {
  console.error(e)
})
