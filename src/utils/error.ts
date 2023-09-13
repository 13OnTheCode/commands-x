import path from 'node:path'
import process from 'node:process'

import { cyan, gray, red } from './color'
import { isFunction, isUndefined } from './is'
import { normalizePath } from './path'

export function formatStack(stack: string) {
  const dir = normalizePath(process.cwd() + path.sep)

  return stack
    .split('\n')
    .slice(1)
    .map(
      (line) => '\n  ' + line
        .trim()
        .replace(/^at/, (m) => gray(m))
        .replace(/[A-Za-z]+:\S+:\d+:\d+/, (m) => cyan(normalizePath(m)))
        .replace(/file:\/\/\/?/, '')
        .replace(new RegExp(dir, 'i'), '')
    ).join('')
}

export function formatError(error: Error) {
  const { message, name, stack } = error
  let result = red(message ? `${name}: ${message}` : name)

  if (stack && typeof stack === 'string') {
    result += formatStack(stack)
  }

  return result
}

export function processError(
  error: unknown,
  handleError?: ((error: unknown) => unknown) | boolean
) {
  if (isFunction(handleError)) {
    handleError(error)
  }

  if (isUndefined(handleError) || handleError === true) {
    console.error('\n', error instanceof Error ? formatError(error) : error, '\n')
    process.exit(1)
  }
}
