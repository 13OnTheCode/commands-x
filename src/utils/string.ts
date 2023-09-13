import { isNotEmptyString } from './is'

export function kebabCase(string: string) {
  return string
    .replaceAll(/(^[^\dA-Za-z]+)|([^\dA-Za-z]+$)/g, '')
    .replaceAll(/([a-z])([A-Z])/g, '$1-$2')
    .replaceAll(/([A-Za-z])(\d)/g, '$1-$2')
    .replaceAll(/(\d)([A-Za-z])/g, '$1-$2')
    .replaceAll(/[^\dA-Za-z]+/g, '-')
    .toLowerCase()
}

export function camelCase(string: string) {
  const words = string.replaceAll(/[^\dA-Za-z]+/g, ' ').trim().split(' ')
  const camelWords = []

  for (const [index, word] of words.entries()) {
    camelWords.push(index === 0 ? word.toLowerCase() : word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
  }

  return camelWords.join('')
}

export type SingleChar =
  | '0' | '1' | '2' | '3' | '4' | '5' | '6' | '7' | '8' | '9' | 'A' | 'B'
  | 'C' | 'D' | 'E' | 'F' | 'G' | 'H' | 'I' | 'J' | 'K' | 'L' | 'M' | 'N'
  | 'O' | 'P' | 'Q' | 'R' | 'S' | 'T' | 'U' | 'V' | 'W' | 'X' | 'Y' | 'Z'
  | 'a' | 'b' | 'c' | 'd' | 'e' | 'f' | 'g' | 'h' | 'i' | 'j' | 'k' | 'l'
  | 'm' | 'n' | 'o' | 'p' | 'q' | 'r' | 's' | 't' | 'u' | 'v' | 'w' | 'x'
  | 'y' | 'z'

export function isSingleChar(char: string): char is SingleChar {
  return isNotEmptyString(char) && /^[\dA-Za-z]$/.test(char)
}
