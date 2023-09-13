import { matchCommand } from './command'
import type { Command, CommandArgs, CommandSubs } from './types'
import { processError } from './utils/error'
import { isNotEmptyString } from './utils/is'
import { readPackage } from './utils/package'

export interface ShowVersionOptions {
  argv?: string[]
  handleError?: ((error: unknown) => unknown) | boolean
}

export async function showVersion<
  Args extends CommandArgs,
  Subs extends CommandSubs
>(
  command: Command<Args, Subs>,
  options: ShowVersionOptions = {}
) {
  const { argv, handleError } = { argv: process.argv.slice(2), ...options }

  try {
    const matchedCommand = await matchCommand(command, { argv, handleError: false, handleParseError: false })

    const metas = {
      version: ''
    }

    for (const [index, matched] of matchedCommand.entries()) {
      const { version } = matched.command.meta ?? {}

      if (index === 0) {
        const pkg = readPackage()
        metas.version = version ?? pkg.version
      } else {
        metas.version = version ?? metas.version
      }
    }

    process.stdout.write(isNotEmptyString(metas.version) ? `v${metas.version}` : 'unknown')
  } catch (error) {
    processError(error, handleError)
  }
}
