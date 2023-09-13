import type { Resolvable } from './utils/resolve'
import type { SingleChar } from './utils/string'

// Arg

export type Arg<
  Type extends ArgType,
  ValueType extends ArgValueType
> = {
  type: Type
  alias?: SingleChar
  isRequired?: boolean
  description?: string
  defaultValue?: ValueType
}

export type ArgType = 'boolean' | 'number' | 'positional' | 'string'

export type ArgValueType = boolean | number | string

export type PositionalArg = Omit<Arg<'positional', string>, 'alias'>

export type BooleanArg = Arg<'boolean', boolean>

export type StringArg = Arg<'string', string>

export type NumberArg = Arg<'number', number>

// Command

export type Command<
  Args extends CommandArgs,
  Subs extends CommandSubs
> = {
  meta?: CommandMeta
  args?: CommandArgs & Args
  main?: CommandMain<Args>
  subs?: {
    [K in keyof Subs]: Resolvable<Command<Subs[K] & CommandArgs, CommandSubs>>
  }
}

export type CommandMeta = {
  name?: string
  version?: string
  description?: string
}

export type CommandSubs = Record<string, unknown>

export type CommandArgs = Record<string, BooleanArg | NumberArg | PositionalArg | StringArg>

export type CommandMain<Args extends CommandArgs> = (context: ParsedContext<Args>) => Promise<void> | void

export type MatchedCommand<
  Args extends CommandArgs,
  Subs extends CommandSubs
> = {
  command: Command<Args, Subs>
  context: ParsedContext<Args>
}

// Parser

export type ParsedArgv = {
  end: string[]
  unknown: Record<string, ArgValueType>
  positional: string[]
}

export type ParsedArgs<Args extends CommandArgs> = {
  [K in keyof Args]: [
    Args[K] extends PositionalArg ? PositionalArg :
      Args[K] extends StringArg ? StringArg :
        Args[K] extends NumberArg ? NumberArg :
          Args[K] extends BooleanArg ? BooleanArg : Args[K],
    Args[K]['isRequired'],
    Args[K]['defaultValue']
  ] extends [
    infer Type extends CommandArgs[string],
    infer isRequired,
    infer defaultValue
  ]
    ? isRequired extends true
      ? Exclude<Type['defaultValue'], undefined>
      : defaultValue extends Exclude<Type['defaultValue'], undefined>
        ? Exclude<Type['defaultValue'], undefined>
        : Type['defaultValue']
    : never
}

export type ParsedContext<Args extends CommandArgs> = {
  argv: ParsedArgv
  args: ParsedArgs<Args>
}
