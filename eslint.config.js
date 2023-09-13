import { node } from '@13onthecode/eslint-config'

export default [
  ...node,
  {
    rules: {
      'unicorn/no-process-exit': 0,
      'perfectionist/sort-interfaces': 0,
      'perfectionist/sort-objects': 0,
      'perfectionist/sort-object-types': 0,
      '@typescript-eslint/consistent-type-definitions': 0
    }
  },
  {
    files: ['examples/**/*.ts'],
    rules: {
      'no-console': 0
    }
  }
]
