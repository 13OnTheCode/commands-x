import { runCommand } from '../src'

runCommand({
  meta: {
    name: 'subs',
    version: '0.0.1',
    description: 'subs description...'
  },
  subs: {
    dev: () => import('./commands/dev').then((r) => r.default),
    build: () => import('./commands/build').then((r) => r.default)
  }
})
