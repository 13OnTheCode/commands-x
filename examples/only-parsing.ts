import { parse } from '../src'

const parsed = parse({
  args: {
    dir: {
      type: 'positional',
      isRequired: true
    },
    port: {
      type: 'number',
      alias: 'p',
      defaultValue: 3000
    },
    debug: {
      type: 'boolean',
      alias: 'd'
    }
  }
})

console.log(parsed)
