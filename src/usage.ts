import process from 'node:process'

import { matchCommand } from './command'
import type { Command, CommandArgs, CommandSubs, MatchedCommand } from './types'
import { bold, cyan, gray, stripColor, underline } from './utils/color'
import { processError } from './utils/error'
import { isNotEmptyArray, isNotEmptyObject, isString, isUndefined } from './utils/is'
import { readPackage } from './utils/package'
import { resolve } from './utils/resolve'
import { kebabCase } from './utils/string'

export interface ShowUsageOptions {
  argv?: string[]
  handleError?: ((error: unknown) => unknown) | boolean
}

export async function showUsage<
  Args extends CommandArgs,
  Subs extends CommandSubs
>(
  command: Command<Args, Subs>,
  options: ShowUsageOptions = {}
) {
  const { argv, handleError } = { argv: process.argv.slice(2), ...options }

  try {
    const matchedCommand = await matchCommand(command, { argv, handleError: false, handleParseError: false })

    const metas = {
      name: '',
      version: '',
      description: ''
    }

    for (const [index, matched] of matchedCommand.entries()) {
      const { name, version, description } = matched.command.meta ?? {}

      if (index === 0) {
        const pkg = readPackage()
        metas.name = name ?? pkg.name
        metas.version = version ?? pkg.version
        metas.description = description ?? pkg.description
      } else {
        metas.name = `${metas.name} ${name}`
        metas.version = version ?? metas.version
        metas.description = description ?? metas.description
      }
    }

    const lines = {
      usage: [] as string[],
      arguments: [] as string[][],
      options: [] as string[][],
      commands: [] as string[][]
    }

    const { command: { args, subs } } = matchedCommand.at(-1) as MatchedCommand<Args, Subs>

    if (isNotEmptyObject(args)) {
      for (const [argName, argOptions] of Object.entries(args)) {
        const { type, description, defaultValue, isRequired: _isRequired } = argOptions

        const isRequired = _isRequired === true && defaultValue === undefined
        const isPositional = type === 'positional'

        const requiredPart = isRequired ? '(required)' : ''
        const defaultValuePart = isUndefined(defaultValue) ? '' : `(default: ${isString(defaultValue) ? `"${defaultValue}"` : defaultValue})`
        const descriptionPart = description ?? ''

        if (isPositional) {
          const name = kebabCase(argName)
          lines.usage.push(isRequired ? `<${name}>` : `[${name}]`)
          lines.arguments.push([cyan(name), requiredPart + defaultValuePart, descriptionPart])
          continue
        }

        const { alias } = argOptions

        const name = isString(alias) && alias.length === 1 ? `-${alias}, --${kebabCase(argName)}` : `--${kebabCase(argName)}`

        lines.options.push([cyan(name), requiredPart + defaultValuePart, descriptionPart])
      }
    }

    if (isNotEmptyObject(subs)) {
      for (const [subName, subOptions] of Object.entries(subs)) {
        const commandSub = await resolve(subOptions)
        lines.commands.push([cyan(subName), '', commandSub.meta?.description ?? ''])
      }
    }

    const hasUsage = lines.usage.length > 0
    const hasArguments = lines.arguments.length > 0
    const hasOptions = lines.options.length > 0
    const hasCommands = lines.commands.length > 0

    const output: (string | string[] | string[][])[] = [
      gray(`${metas.name + (metas.version ? ` v${metas.version}` : '') + (metas.description ? ` - ${metas.description}` : '')}`),
      underline(bold('USAGE')),
      [cyan(`${metas.name}${hasOptions ? ' [options]' : ''}${hasUsage ? ' ' + lines.usage.join(' ') : ''}${hasCommands ? ' <commands>' : ''}`)]
    ]

    if (hasArguments) {
      output.push(
        underline(bold('ARGUMENTS')),
        lines.arguments
      )
    }

    if (hasOptions) {
      output.push(
        underline(bold('OPTIONS')),
        lines.options
      )
    }

    if (hasCommands) {
      output.push(
        underline(bold('COMMANDS')),
        lines.commands,
        `Use ${cyan(`${metas.name} <commands> --help`)} for more information about a command`
      )
    }

    process.stdout.write('\n' + formatLines(output) + '\n\n')
  } catch (error) {
    processError(error, handleError)
  }
}

function formatLines(lines: (string | string[] | string[][])[]) {
  const maxLengths: number[] = []

  for (const line of lines) {
    if (isNotEmptyArray(line)) {
      for (const item of line) {
        if (isNotEmptyArray(item)) {
          for (const [i, column] of item.entries()) {
            maxLengths[i] = Math.max(maxLengths[i] ?? 0, stripColor(column).length)
          }
        }
      }
    }
  }

  const formattedLines: string[] = []

  for (const line of lines) {
    if (isNotEmptyArray(line)) {
      const formattedItems: string[] = []

      for (const item of line) {
        if (isNotEmptyArray(item)) {
          let formattedColumns = ''

          for (const [i, column] of item.entries()) {
            const width = maxLengths[i] ?? 0
            const originalLength = column.length
            const strippedLength = stripColor(column).length
            const lengthDifference = strippedLength - originalLength
            formattedColumns += column.padEnd(width - lengthDifference) + '  '
          }

          formattedItems.push('  ' + formattedColumns)
        } else {
          formattedItems.push('  ' + item)
        }
      }

      formattedLines.push(formattedItems.join('\n') + '\n\n')
    } else {
      formattedLines.push(line + '\n\n')
    }
  }

  return formattedLines.join('').trim()
}
