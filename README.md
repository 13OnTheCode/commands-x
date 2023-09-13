# Commands-x

[![NPM Version](https://img.shields.io/npm/v/commands-x?color=131313&label=)](https://www.npmjs.com/package/commands-x)
[![License](https://img.shields.io/npm/l/commands-x?color=131313&label=)](LICENSE.md)

English | [简体中文](README.CN.md)

Elegant command-line interface (CLI) development tool, providing a set of features and utilities to simplify the process of creating command-line applications

## Features
- Zero dependencies
- Sub-commands support
- Strongly typed arguments
- Auto generated usage and version
- Fast and lightweight arguments parser

## Playground

You can try it out online in a live demo environment:

[Live Demo](https://stackblitz.com/edit/commands-x-demo)

## Install

```bash
npm install commands-x --save-dev
```

## Quick Start

The simplest way to create a CLI application:

Create a file: [simple.ts](https://github.com/13OnTheCode/commands-x/blob/main/examples/simple.ts)

```javascript
import { runCommand } from 'commands-x'

runCommand({
  meta: {
    name: 'simple',
    version: '0.0.1',
    description: 'simple description...'
  },
  args: {
    firstName: {
      type: 'positional',
      description: 'Your first name',
      isRequired: true
    },
    lastName: {
      type: 'positional',
      description: 'Your last name'
    },
    nickName: {
      type: 'string',
      description: 'Your nick name',
      alias: 'n'
    },
    age: {
      type: 'number',
      description: 'Your age',
      alias: 'a'
    },
    isDeveloper: {
      type: 'boolean',
      description: 'You are developer or not?',
      alias: 'd',
      defaultValue: false
    }
  },
  main: (context) => {
    //
    // In development, type hints are provided
    //
    // context: {
    //   // Parsed command-line input arguments
    //   argv: {
    //     end: string[],
    //     unknown: Record<string, boolean | number | string>,
    //     positional: string[]
    //   }
    //   // Parsed user-defined arguments
    //   args: {
    //     firstName: string
    //     lastName: string | undefined
    //     nickName: string | undefined
    //     age: number | undefined
    //     isDeveloper: boolean
    //   }
    // }
    //
    console.log(context)
  }
})
```

Run the script to see it in action:

```bash
$ tsx examples/simple John Doe -n John -a 26 -d

{
  argv: { end: [], unknown: {}, positional: [] },
  args: {
    nickName: 'John',
    age: 26,
    isDeveloper: true,
    firstName: 'John',
    lastName: 'Doe'
  }
}
```

By default, errors are captured, formatted, and printed to the console:

```bash
$ tsx examples/simple

Error: Missing required argument: first-name
  at parse (src/parser.ts:169:17)
  at matchCommand (src/command.ts:35:31)
  at runCommand (src/command.ts:114:28)
```

By default, `--help` or `-h` is used to show usage:

```bash
$ tsx examples/simple -h

simple v0.0.1 - simple description...

USAGE

  simple [options] <first-name> [last-name]

ARGUMENTS

  first-name          (required)        Your first name
  last-name                             Your last name

OPTIONS

  -n, --nick-name                       Your nick name
  -a, --age                             Your age
  -d, --is-developer  (default: false)  You are developer or not?
```

By default, `--version` or `-v` is used to show version:

```bash
$ tsx examples/simple -v
v0.0.1
```

You can control the above default behavior by passing configuration parameters.

If you want to disable:

```javascript
runCommand(
  {
    ...
  },
  {
    handleError: false,
    handleUsage: false,
    handleVersion: false
  }
)
```

If you want to customize handling:

```javascript
runCommand(
  {
    ...
  },
  {
    handleError: (error) => { ... },
    handleUsage: (command, { argv }) => { ... },
    handleVersion: (command, { argv }) => { ... }
  }
)
```

## Examples
- [simple](https://github.com/13OnTheCode/commands-x/blob/main/examples/simple.ts)
- [sub-commands](https://github.com/13OnTheCode/commands-x/blob/main/examples/sub-commands.ts)
- [only-parsing](https://github.com/13OnTheCode/commands-x/blob/main/examples/only-parsing.ts)

## Utils

### [`defineCommand`](https://github.com/13OnTheCode/commands-x/blob/main/src/command.ts#L9-L14)

A type helper for defining commands.

### [`matchCommand`](https://github.com/13OnTheCode/commands-x/blob/main/src/command.ts#L22-L70)

Matches commands and return an array containing matched command objects and parsed command-line input arguments objects. The first element is the main-command, and the second element is the selected sub-command.

### [`runCommand`](https://github.com/13OnTheCode/commands-x/blob/main/src/command.ts#L82-L126)

Runs commands with auto generated usage/version help and graceful error handling by default.

### [`showVersion`](https://github.com/13OnTheCode/commands-x/blob/main/src/version.ts#L12-L43)

Generates version and prints to the console.

### [`showUsage`](https://github.com/13OnTheCode/commands-x/blob/main/src/usage.ts#L17-L129)

Generates usage and prints to the console.

### [`parse`](https://github.com/13OnTheCode/commands-x/blob/main/src/parser.ts#L12-L178)

Parses command-line input arguments and convert them into an easily usable data structure based on user-defined arguments specifications.

## License

[MIT](LICENSE.md) License &copy; 2023-PRESENT [13OnTheCode](https://github.com/13OnTheCode)
