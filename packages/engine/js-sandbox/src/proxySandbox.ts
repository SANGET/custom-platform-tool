import {  IFakeWindow, IOptions, IBlackMap } from "./interfaces"
import { createFakeWindow, uniq } from "./utils"
import { getProxyPropertyGetter, getProxyPropertyValue, getTargetValue } from "./common"
/**
 * 将无法覆盖的变量从代理沙箱中转出
 */
const unscopables = {
  undefined: true,
  Array: true,
  Object: true,
  String: true,
  Boolean: true,
  Math: true,
  eval: true,
  Number: true,
  Symbol: true,
  parseFloat: true,
  Float32Array: true,
}
type SymbolTarget = 'target' | 'context'
/**
 *  属性代理
 */
export default class ProxySandbox {
  public proxy: WindowProxy & any
  public options: IOptions
  public context: any
  constructor(context: any, options: IOptions) {
    this.options = options
    this.context = context
    this.proxy = this.createProxy()
  }
  public createProxy() {
    const blackmap = this.options && this.getBlackMap() || {}
    const context = Object.assign({}, window, this.context)
    const { fakeWindow, propertiesWithGetter} = createFakeWindow(window)
    const descriptorTargetMap = new Map<PropertyKey, SymbolTarget>()
    const hasOwnProperty = (key: PropertyKey) => fakeWindow.hasOwnProperty(key) || context.hasOwnProperty(key)
    const proxy = new Proxy(Object.assign(fakeWindow, this.context), {
      /**
       * 属性设置拦截
       * @param target
       * @param p
       * @param value
       */
      set(target: IFakeWindow, p: PropertyKey, value: any, receiver: any): boolean {
        // @ts-ignore
        target[`${p}`] = value
        return true
        // return Reflect.set(target, p, value, receiver);

      },
      /**
       * 属性获取拦截
       * 根据不同的属性进行对应处理
       * @param target
       * @param p
       */
      get(target: IFakeWindow, p: PropertyKey ): any {
        if (blackmap.hasOwnProperty(p)) {
          console.error(`属性${p as string}被拦截`);
          return undefined
        }
        if (p === Symbol.unscopables) return unscopables
        /** 避免使用window.window或window.self逃离沙盒环境以触摸真正的窗口 或使用window.top检查iframe上下文 */
        if (p === 'top' || p === 'window' || p === 'self') {
          return proxy
        }
        if (p === 'hasOwnProperty') {
          return hasOwnProperty
        }
        const proxyPropertyGetter = getProxyPropertyGetter(proxy, p)
        if (proxyPropertyGetter) {
          return getProxyPropertyValue(proxyPropertyGetter)
        }

        const value = propertiesWithGetter.has(p) ? (context as any)[p] : (target as any)[p] || (context as any)[p];
        return getTargetValue(context, value);
      },
      /**
       * PropertyKey in proxy的操作，返回一个布尔值。
       * @param target
       * @param p
       */
      has(target: IFakeWindow, p: PropertyKey) {
        return p in unscopables || p in target || p in context
      },
      /**
       * 拦截Object.getOwnPropertyDescriptor(proxy, propKey)，返回属性的描述对象。
       *
       * @param target
       * @param p
       */
      getOwnPropertyDescriptor(target: IFakeWindow, p: PropertyKey): PropertyDescriptor | undefined {
        if (target.hasOwnProperty(p)) {
          const descriptor = Object.getOwnPropertyDescriptor(target, p)
          descriptorTargetMap.set(p, 'target')
          return descriptor
        }

        if (context.hasOwnProperty(p)) {
          const descriptor = Object.getOwnPropertyDescriptor(context, p)
          descriptorTargetMap.set(p, 'context')
          return descriptor
        }

        return undefined
      },
      /**
       * 拦截Object.getOwnPropertyNames(proxy)、Object.getOwnPropertySymbols(proxy)、Object.keys(proxy)、for...in循环，返回一个数组。
       * 该方法返回目标对象所有自身的属性的属性名，而Object.keys()的返回结果仅包括目标对象自身的可遍历属性。
       * @param target
       */
      ownKeys(target: IFakeWindow): PropertyKey[] {
        return uniq(Reflect.ownKeys(context).concat(Reflect.ownKeys(target)))
      },
      /**
       *
       * @param target
       * @param p
       * @param attributes
       */
      defineProperty(target: Window, p: PropertyKey, attributes: PropertyDescriptor): boolean {
        const from = descriptorTargetMap.get(p)
        switch (from) {
          case 'context':
            return Reflect.defineProperty(context, p, attributes)
          default:
            return Reflect.defineProperty(target, p, attributes)
        }
      },
      /**
       *
       * @param target
       * @param p
       */
      deleteProperty(target: IFakeWindow, p: PropertyKey): boolean {
        if (target.hasOwnProperty(p)) {
          // @ts-ignore
          delete target[p]
          return true
        }
        return true
      },
    })
    return proxy
  }
  /**
   * 获取黑名单属性
   */
  public getBlackMap() {
    const blackmap: IBlackMap = {};
    const { blackList = [] } = this.options
    for (let i = 0; i < blackList.length; i++) {
      const name = blackList[i]
      blackmap[name] = true
    }
    return blackmap
  }
}

