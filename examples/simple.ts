import { runCommand } from '../src'

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
