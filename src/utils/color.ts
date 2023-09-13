import process from 'node:process'
import tty from 'node:tty'

const { argv = [], env = {}, platform = '' } = process

const isDisabled = 'NO_COLOR' in env || argv.includes('--no-color')

const isForced = 'FORCE_COLOR' in env || argv.includes('--color')

const isWindows = platform === 'win32'

const isDumbTerminal = env.TERM === 'dumb'

const isCompatibleTerminal = tty.isatty(1) && env.TERM && !isDumbTerminal

const isCI = 'CI' in env && ('GITHUB_ACTIONS' in env || 'GITLAB_CI' in env || 'CIRCLECI' in env)

const isColorSupported = !isDisabled && (isForced || (isWindows && !isDumbTerminal) || isCompatibleTerminal || isCI)

function replaceClose(
  index: number,
  string: string,
  close: string,
  replace: string
): string {
  const head = string.slice(0, Math.max(0, index)) + replace
  const tail = string.slice(Math.max(0, index + close.length))
  const next = tail.indexOf(close)

  return head + (next < 0 ? tail : replaceClose(next, tail, close, replace))
}

function clearBleed(
  index: number,
  string: string,
  open: string,
  close: string,
  replace: string
) {
  return index < 0
    ? open + string + close
    : open + replaceClose(index, string, close, replace) + close
}

function filterEmpty(
  open: string,
  close: string,
  replace: string = open
) {
  return (string: string) => {
    if (string && string.trim() !== '') {
      const at = open.length + 1
      const index = ('' + string).indexOf(close, at)

      return clearBleed(index, string, open, close, replace)
    }

    return ''
  }
}

function init(open: number, close: number, replace?: string) {
  return isColorSupported
    ? filterEmpty(`\u001B[${open}m`, `\u001B[${close}m`, replace)
    : String
}

export function stripColor(string: string) {
  // eslint-disable-next-line no-control-regex
  return string.replaceAll(/\u001B\[\d+m/g, '')
}

export const black = init(30, 39)
export const blackBright = init(90, 39)
export const blue = init(34, 39)
export const blueBright = init(94, 39)
export const cyan = init(36, 39)
export const cyanBright = init(96, 39)
export const gray = init(90, 39)
export const green = init(32, 39)
export const greenBright = init(92, 39)
export const magenta = init(35, 39)
export const magentaBright = init(95, 39)
export const red = init(31, 39)
export const redBright = init(91, 39)
export const white = init(37, 39)
export const whiteBright = init(97, 39)
export const yellow = init(33, 39)
export const yellowBright = init(93, 39)

export const bgBlack = init(40, 49)
export const bgBlackBright = init(100, 49)
export const bgBlue = init(44, 49)
export const bgBlueBright = init(104, 49)
export const bgCyan = init(46, 49)
export const bgCyanBright = init(106, 49)
export const bgGreen = init(42, 49)
export const bgGreenBright = init(102, 49)
export const bgMagenta = init(45, 49)
export const bgMagentaBright = init(105, 49)
export const bgRed = init(41, 49)
export const bgRedBright = init(101, 49)
export const bgWhite = init(47, 49)
export const bgWhiteBright = init(107, 49)
export const bgYellow = init(43, 49)
export const bgYellowBright = init(103, 49)

export const bold = init(1, 22, '\u001B[22m\u001B[1m')
export const dim = init(2, 22, '\u001B[22m\u001B[2m')
export const hidden = init(8, 28)
export const inverse = init(7, 27)
export const italic = init(3, 23)
export const reset = init(0, 0)
export const strikethrough = init(9, 29)
export const underline = init(4, 24)
