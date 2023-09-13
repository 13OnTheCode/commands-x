import { defineCommand } from '../../src'

export default defineCommand({
  meta: {
    name: 'build',
    description: 'build description...'
  },
  args: {
    dir: {
      type: 'positional',
      description: 'Target directory',
      isRequired: true
    },
    minify: {
      type: 'boolean',
      description: 'Minify build',
      alias: 'm',
      defaultValue: false
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
