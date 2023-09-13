import { isArray, isObject, isString } from './is'

export function hasOwn(
  object: Record<PropertyKey, unknown>,
  property: PropertyKey
) {
  return Object.prototype.hasOwnProperty.call(object, property)
}

export function merge(...objects: Record<PropertyKey, unknown>[]) {
  const result: Record<PropertyKey, unknown> = {}

  for (const obj of objects) {
    if (!isObject(obj)) {
      throw new Error('Each argument type must be: object')
    }

    for (const key in obj) {
      if (hasOwn(obj, key)) {
        const currentValue = result[key]
        const newValue = obj[key]

        if (isObject(currentValue) && isObject(newValue)) {
          result[key] = merge(currentValue, newValue)
        } else if (isArray(currentValue) && isArray(newValue)) {
          result[key] = [...currentValue, ...newValue]
        } else {
          result[key] = newValue
        }
      }
    }
  }

  return result
}

export function getValueAtPath(
  object: Record<PropertyKey, unknown>,
  path: (number | string)[] | string
) {
  if (!isObject(object)) {
    throw new Error('Parameter "object" type must be: object')
  }

  if (!(isString(path) || isArray(path))) {
    throw new Error('Parameter "path" type must be one of: array, string')
  }

  if (isString(path)) {
    path = path.replaceAll('[', '.').replaceAll(']', '').split('.')
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  let result: any = object

  for (const key of path) {
    result = result[key]

    if (result === undefined) {
      return undefined
    }
  }

  return result as unknown
}

export function setValueAtPath(
  object: object,
  path: (number | string)[] | string,
  value: unknown
) {
  if (!isObject(object)) {
    throw new Error('Parameter "object" type must be: object')
  }

  if (!(isString(path) || isArray(path))) {
    throw new Error('Parameter "path" type must be one of: array, string')
  }

  if (isString(path)) {
    path = path.replaceAll('[', '.').replaceAll(']', '').split('.')
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  let current: any = object

  for (const key of path) {
    if (!hasOwn(current, key)) {
      current[key] = /^\d+$/.test(path[path.indexOf(key) + 1] as string) ? [] : {}
    }

    if (path.indexOf(key) === path.length - 1) {
      current[key] = value
    }

    current = current[key]
  }
}
