// scripts/build-index.ts
import fs from 'fs'
import path from 'path'

const baseDir = path.resolve('src')
const folders = ['composables', 'utils']

for (const folder of folders) {
  const dirPath = path.join(baseDir, folder)
  const files = fs.readdirSync(dirPath).filter(f =>
    f.endsWith('.ts') || f.endsWith('.vue')
  )

  const exports = files
    .filter(f => f !== 'index.ts')
    .map(f => `export * from './${f.replace(/\.(ts|vue)$/, '')}'`)
    .join('\n')

  fs.writeFileSync(path.join(dirPath, 'index.ts'), exports)
}

const rootExports = folders.map(f => `export * from './${f}/index'`).join('\n')
fs.writeFileSync(path.join(baseDir, 'index.ts'), rootExports)
