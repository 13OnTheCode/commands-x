import { defineCommand } from '../../src'

export default defineCommand({
  meta: {
    name: 'dev',
    description: 'dev description...'
  },
  args: {
    dir: {
      type: 'positional',
      description: 'Target directory',
      isRequired: true
    },
    port: {
      type: 'number',
      description: 'Port number',
      alias: 'p',
      defaultValue: 3000
    },
    debug: {
      type: 'boolean',
      description: 'Debug mode',
      alias: 'd'
    }
  },
  main: (context) => {
    console.log(context)
  }
})
