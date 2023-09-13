import { isFunction } from './is'

export type Awaitable<T> = () => Promise<T> | T

export type Resolvable<T> = (() => Promise<T>) | (() => T) | Promise<T> | T

export function resolve<T>(v: Resolvable<T>) {
  return isFunction(v) ? v() : v
}
