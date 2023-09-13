import path from 'node:path'
import url from 'node:url'

export function normalizePath(inputPath: URL | string) {
  return ((inputPath instanceof URL ? url.fileURLToPath(inputPath) : inputPath) + path.sep).split(path.sep).join('/').slice(0, -1)
}
