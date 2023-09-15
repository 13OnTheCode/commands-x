# Commands-X

[![NPM Version](https://img.shields.io/npm/v/commands-x?color=131313&label=)](https://www.npmjs.com/package/commands-x)
[![License](https://img.shields.io/npm/l/commands-x?color=131313&label=)](LICENSE.md)

[English](README.md) | 简体中文

优雅的命令行界面（CLI）开发工具，提供了一组功能和实用工具，以简化创建命令行应用程序的过程

## Features
- 无依赖
- 支持子命令
- 强类型参数
- 自动生成用法和版本信息
- 快速轻量级的参数解析器

## Playground

您可以前往在线实时演示环境中尝试它：

[Live Demo](https://stackblitz.com/edit/commands-x-demo)

## Install

```bash
npm install commands-x --save-dev
```

## Quick Start

创建一个 CLI 应用程序的最简单方式：

创建文件: [simple.ts](https://github.com/13OnTheCode/commands-x/blob/main/examples/simple.ts)

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

运行脚本查看它的运行效果：

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

默认情况下，错误会被捕获、格式化，并打印到控制台：

```bash
$ tsx examples/simple

Error: Missing required argument: first-name
  at parse (src/parser.ts:169:17)
  at matchCommand (src/command.ts:35:31)
  at runCommand (src/command.ts:114:28)
```

默认情况下，使用 `--help` 或 `-h` 来显示用法：

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

默认情况下，使用 `--version` 或 `-v` 来显示版本信息：

```bash
$ tsx examples/simple -v
v0.0.1
```

你可以通过传递配置参数来控制上述默认行为。

如果你想要禁用：

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

如果你想要自定义处理：

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

用于定义命令的类型助手

### [`matchCommand`](https://github.com/13OnTheCode/commands-x/blob/main/src/command.ts#L22-L70)

匹配命令并返回一个包含匹配的命令对象和解析的命令行输入参数对象的数组。第一个元素是主命令，第二个元素是选择的子命令

### [`runCommand`](https://github.com/13OnTheCode/commands-x/blob/main/src/command.ts#L82-L126)

运行命令，默认情况下使用自动生成用法/版本帮助和优雅的错误处理

### [`showVersion`](https://github.com/13OnTheCode/commands-x/blob/main/src/version.ts#L12-L43)

生成版本信息并打印到控制台

### [`showUsage`](https://github.com/13OnTheCode/commands-x/blob/main/src/usage.ts#L17-L129)

生成用法信息并打印到控制台

### [`parse`](https://github.com/13OnTheCode/commands-x/blob/main/src/parser.ts#L12-L178)

解析命令行输入参数，并根据用户定义的参数规范将其转换为易于使用的数据结构

## License

[MIT](LICENSE.md) License &copy; 2023-PRESENT [13OnTheCode](https://github.com/13OnTheCode)
