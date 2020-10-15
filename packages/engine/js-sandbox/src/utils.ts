import { IFakeWindow } from "./interfaces"


export function uniq(array: PropertyKey[]) {
  return array.filter(function filter(this: string[], element) {
    return element in this ? false : ((this as any)[element] = true)
  }, {})
}

export function isConstructable(fn: () => void | FunctionConstructor) {
  const constructableFunctionRegex = /^function\b\s[A-Z].*/
  const classRegex = /^class\b/
  // 有 prototype 并且 prototype 上有定义一系列非 constructor 属性，则可以认为是一个构造函数
  return (
    (fn.prototype && fn.prototype.constructor === fn && Object.getOwnPropertyNames(fn.prototype).length > 1) ||
    constructableFunctionRegex.test(fn.toString()) ||
    classRegex.test(fn.toString())
  )
}

export function isBoundedFunction(fn: CallableFunction) {
  /*
   indexOf is faster than startsWith
   see https://jsperf.com/string-startswith/72
   */
  return fn.name.indexOf('bound ') === 0 && !fn.hasOwnProperty('prototype')
}

/**
 * in safari
 * typeof document.all === 'undefined' // true
 * typeof document.all === 'function' // true
 * 区分苹果浏览器
 */
const naughtySafari = typeof document.all === 'function' && typeof document.all === 'undefined'
export const isCallable = naughtySafari
  ? (fn: any) => typeof fn === 'function' && typeof fn !== 'undefined'
  : (fn: any) => typeof fn === 'function'
/**
 * @export fakeWindow propertiesWithGetter
 * @param {Window} global
 */
export function createFakeWindow(global: Window) {
  const propertiesWithGetter = new Map<PropertyKey, boolean>()
  const fakeWindow = {} as IFakeWindow
  /***
   * 复制global 不可配置的属性 给 fakeWindow
   * 如果属性不作为目标对象的自身属性存在，或者作为目标对象的可配置自身属性存在，则不能将其报告为不可配置。
   */
  Object.getOwnPropertyNames(global)
    .filter(property => {
      const descriptor = Object.getOwnPropertyDescriptor(global, property)
      return !descriptor?.configurable
    })
    .forEach(property => {
      const descriptor = Object.getOwnPropertyDescriptor(global, property)
      if(descriptor) {
        const hasGetter = Object.prototype.hasOwnProperty.call(descriptor, 'get')
        if(property === 'top' || property === 'self' || property === 'window' || property === 'document') {
          descriptor.configurable = true
          if(!hasGetter) descriptor.writable = true
        }
        if(hasGetter) propertiesWithGetter.set(property, true)
        /***
         * 冻结 descriptor 属性 防止被其它地方修改 例如 angular zone.js
         * https://github.com/angular/zone.js/blob/a5fe09b0fac27ac5df1fa746042f96f05ccb6a00/lib/browser/define-property.ts
         */
        Object.defineProperty(fakeWindow, property, Object.freeze(descriptor))
      }
    })
  return {
    fakeWindow,
    propertiesWithGetter
  }
}
