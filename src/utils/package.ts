import fs from 'node:fs'
import path from 'node:path'

import { normalizePath } from './path'

export function readPackage(
  filePath: URL | string = path.resolve('package.json')
) {
  const file = fs.readFileSync(normalizePath(filePath), 'utf8')

  return JSON.parse(file)
}
