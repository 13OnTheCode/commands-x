const opt = Object.prototype.toString

export function isString(v: unknown): v is string {
  return opt.call(v) === '[object String]'
}

export function isEmptyString(v: unknown): v is string {
  return isString(v) && v.trim() === ''
}

export function isNotEmptyString(v: unknown): v is string {
  return isString(v) && v.trim() !== ''
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function isArray(v: unknown): v is any[] {
  return opt.call(v) === '[object Array]'
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function isEmptyArray(v: unknown): v is any[] {
  return isArray(v) && v.length === 0
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function isNotEmptyArray(v: unknown): v is any[] {
  return isArray(v) && v.length > 0
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function isObject(v: unknown): v is Record<PropertyKey, any> {
  return opt.call(v) === '[object Object]'
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function isEmptyObject(v: unknown): v is Record<PropertyKey, any> {
  return isObject(v) && Object.keys(v).length === 0
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function isNotEmptyObject(v: unknown): v is Record<PropertyKey, any> {
  return isObject(v) && Object.keys(v).length > 0
}

export function isNumber(v: unknown): v is number {
  return opt.call(v) === '[object Number]' && !Number.isNaN(v) && Number.isFinite(v)
}

export function isBoolean(v: unknown): v is boolean {
  return opt.call(v) === '[object Boolean]'
}

export function isRegExp(v: unknown): v is RegExp {
  return opt.call(v) === '[object RegExp]'
}

// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
// export function isFile(v: unknown): v is File {
//   return opt.call(v) === '[object File]'
// }

export function isBlob(v: unknown): v is Blob {
  return opt.call(v) === '[object Blob]'
}

export function isHex(v: unknown): v is string {
  return isString(v) && /^#[\dA-Fa-f]{3}$|#[\dA-Fa-f]{6}$/.test(v)
}

export function isRgb(v: unknown): v is string {
  return isString(v) && /^rgb\((\s*\d+\s*,?){3}\)$/.test(v)
}

export function isRgba(v: unknown): v is string {
  return isString(v) && /^rgba\((\s*\d+\s*,\s*){3}\s*\d(\.\d+)?\s*\)$/.test(v)
}

export function isColor(v: unknown): v is string {
  return isHex(v) || isRgb(v) || isRgba(v)
}

export function isUndefined(v: unknown): v is undefined {
  return opt.call(v) === '[object Undefined]'
}

export function isNull(v: unknown): v is null {
  return opt.call(v) === '[object Null]'
}

export function isNullOrUndefined(v: unknown): v is null | undefined {
  return isNull(v) || isUndefined(v)
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function isFunction(v: unknown): v is (...args: any[]) => any {
  return opt.call(v) === '[object Function]'
}

export function isCommonJS() {
  // eslint-disable-next-line @typescript-eslint/prefer-optional-chain, unicorn/prefer-module
  return typeof module !== 'undefined' && module.exports
}
