import { parse } from './parser'
import type { Command, CommandArgs, CommandSubs, MatchedCommand } from './types'
import { showUsage } from './usage'
import { processError } from './utils/error'
import { isFunction, isNotEmptyObject, isUndefined } from './utils/is'
import { resolve } from './utils/resolve'
import { showVersion } from './version'

export function defineCommand<
  Args extends CommandArgs,
  Subs extends CommandSubs
>(command: Command<Args, Subs>) {
  return command
}

export interface MatchCommandOptions {
  argv?: string[]
  handleError?: ((error: unknown) => unknown) | boolean
  handleParseError?: ((error: unknown) => unknown) | boolean
}

export async function matchCommand<
  Args extends CommandArgs,
  Subs extends CommandSubs
>(
  command: Command<Args, Subs>,
  options: MatchCommandOptions = {}
) {
  const { argv, handleError, handleParseError } = { argv: process.argv.slice(2), ...options }

  const result: unknown[] = []

  try {
    const mainCommand = await resolve(command)
    const mainContext = parse({ argv, args: mainCommand.args, handleError: handleParseError })

    result.push({ command: mainCommand, context: mainContext })

    if (isNotEmptyObject(mainCommand.subs)) {
      const name = mainContext.argv.positional[0]

      if (isUndefined(name)) {
        throw new Error('No command specified')
      }

      const subCommand = await resolve(mainCommand.subs[name])

      if (isUndefined(subCommand)) {
        throw new Error(`Unknown command: ${name}`)
      }

      const { version, description } = subCommand.meta ?? {}

      subCommand.meta = { name, version, description }

      const index = argv.indexOf(name)

      const subContext = parse({ argv: argv.slice(index + 1), args: subCommand.args, handleError: handleParseError })

      result.push({ command: subCommand, context: subContext })
    }
  } catch (error) {
    processError(error, handleError)
  }

  return result as [
    MatchedCommand<Args, Subs>,
    ...MatchedCommand<CommandArgs, CommandSubs>[]
  ]
}

export interface RunCommandOptions<
  Args extends CommandArgs,
  Subs extends CommandSubs
> {
  argv?: string[]
  handleError?: ((error: unknown) => unknown) | boolean
  handleUsage?: ((command: Command<Args, Subs>, options: { argv: string[] }) => unknown) | boolean
  handleVersion?: ((command: Command<Args, Subs>, options: { argv: string[] }) => unknown) | boolean
}

export async function runCommand<
  Args extends CommandArgs,
  Subs extends CommandSubs
>(
  command: Command<Args, Subs>,
  options: RunCommandOptions<Args, Subs> = {}
) {
  const { argv, handleError, handleUsage, handleVersion } = { argv: process.argv.slice(2), ...options }

  try {
    if (argv.includes('--help') || argv.includes('-h')) {
      if (isFunction(handleUsage)) {
        await handleUsage(command, { argv })
      }

      if (isUndefined(handleUsage) || handleUsage === true) {
        await showUsage(command, { argv })
        process.exit(0)
      }
    }

    if (argv.includes('--version') || argv.includes('-v')) {
      if (isFunction(handleVersion)) {
        await handleVersion(command, { argv })
      }

      if (isUndefined(handleVersion) || handleVersion === true) {
        await showVersion(command, { argv })
        process.exit(0)
      }
    }

    const matchedCommand = await matchCommand(command, { argv })

    for (const cmd of matchedCommand) {
      const { command: { main }, context } = cmd as MatchedCommand<Args, Subs>

      if (isFunction(main)) {
        await main(context)
      }
    }
  } catch (error) {
    processError(error, handleError)
  }
}
