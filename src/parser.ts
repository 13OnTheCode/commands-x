import type { CommandArgs, ParsedContext } from './types'
import { processError } from './utils/error'
import { isBoolean, isNotEmptyArray, isNotEmptyObject, isNumber, isString, isUndefined } from './utils/is'
import { isSingleChar, kebabCase } from './utils/string'

export interface ParseOptions<Args extends CommandArgs> {
  args?: CommandArgs & Args
  argv?: string[]
  handleError?: ((error: unknown) => unknown) | boolean
}

export function parse<Args extends CommandArgs>(
  options: ParseOptions<Args> = {}
) {
  const { argv, args, handleError } = { argv: process.argv.slice(2), ...options }

  const maps = {
    name: {} as Record<string, string>,
    alias: {} as Record<string, string>
  }

  const result: ParsedContext<CommandArgs> = {
    argv: {
      end: [],
      unknown: {},
      positional: []
    },
    args: {}
  }

  try {
    if (isNotEmptyObject(args)) {
      for (const [argName, argOptions] of Object.entries(args)) {
        const { type, defaultValue } = argOptions

        if ((!isUndefined(defaultValue)) && (
          (type === 'boolean' && !isBoolean(defaultValue)) ||
          (type === 'string' && !isString(defaultValue)) ||
          (type === 'positional' && !isString(defaultValue)) ||
          (type === 'number' && !isNumber(defaultValue))
        )) {
          const expectedType = type === 'positional' ? 'string' : type
          throw new Error(`The \`defaultValue\` of argument "${argName}" must be one of: ${expectedType} or undefined`)
        }

        if (type === 'positional') {
          continue
        }

        const { alias } = argOptions

        if (!['boolean', 'number', 'string'].includes(type)) {
          throw new Error(`The \`type\` of argument "${argName}" must be one of: "boolean", "number", "string", or "positional"`)
        }

        const kebabCaseName = kebabCase(argName)

        if (!isUndefined(maps.name[argName]) || !isUndefined(maps.name[kebabCaseName])) {
          const errorName = maps.name[argName === kebabCaseName ? argName : kebabCaseName]
          throw new Error(`Invalid argument "${argName}": collides with argument "${errorName}"`)
        }

        maps.name[argName] = argName

        if (argName !== kebabCaseName) {
          maps.name[kebabCaseName] = argName
        }

        if (!isUndefined(alias)) {
          if (!isSingleChar(alias)) {
            throw new Error(`The \`alias\` of argument "${argName}" must be a single char`)
          }

          if (!isUndefined(maps.alias[alias])) {
            throw new Error(`Duplicate alias "${alias}": argument "${argName}" collides with argument "${maps.alias[alias]}"`)
          }

          maps.alias[alias] = argName
        }
      }
    }

    if (isNotEmptyArray(argv)) {
      let skipNext = false

      for (const [index, value] of argv.entries()) {
        if (skipNext) {
          skipNext = false
          continue
        }

        if (value === '--') {
          const val = argv.slice(index + 1)
          result.argv.end.push(...val)
          result.argv.positional.push(...val)
          break
        }

        const dashCount = value.match(/^-+/)?.[0]?.length ?? 0

        const isPositionalArg = dashCount === 0

        const isAliasedArg = dashCount === 1

        const isNamedArg = dashCount === 2

        if (isPositionalArg || (!isAliasedArg && !isNamedArg)) {
          result.argv.positional.push(value)
          continue
        }

        const equalsIndex = value.indexOf('=')

        const hasEquals = equalsIndex > 0

        const key = value.slice(dashCount, hasEquals ? equalsIndex : value.length)

        const isUnknown = !(isAliasedArg && !isUndefined(maps.alias[key])) && !(isNamedArg && !isUndefined(maps.name[key]))

        const nextValue = argv[index + 1]

        const val = hasEquals
          ? (value.slice(equalsIndex + 1))
          : (isUnknown || !nextValue || (nextValue.startsWith('-') && nextValue.length > 1) ? true : nextValue)

        if (isUnknown) {
          result.argv.unknown[key] = val
          continue
        }

        const name = (isAliasedArg ? maps.alias[key] : maps.name[key])!

        const { type } = args![name]!

        if (type === 'boolean') {
          result.args[name] = hasEquals ? val !== 'false' : true
        }

        if (type === 'number') {
          result.args[name] = Number(val)
        }

        if (type === 'string') {
          result.args[name] = val
        }

        if (!hasEquals && type !== 'boolean') {
          skipNext = true
        }
      }
    }

    if (isNotEmptyObject(args)) {
      for (const [argName, argOptions] of Object.entries(args)) {
        const { type, defaultValue, isRequired } = argOptions

        if (type === 'positional') {
          result.args[argName] = result.argv.positional.shift()
        }

        if (isUndefined(result.args[argName])) {
          result.args[argName] = defaultValue
        }

        if (isRequired && isUndefined(result.args[argName])) {
          const errorArgType = type === 'positional' ? 'argument' : 'option'
          const errorArgName = (type === 'positional' ? '' : '--') + kebabCase(argName)
          const errorMessage = `Missing required ${errorArgType}: ${errorArgName}`
          throw new Error(errorMessage)
        }
      }
    }
  } catch (error) {
    processError(error, handleError)
  }

  return result as ParsedContext<Args>
}
