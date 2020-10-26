/** 注册? */
const ctx = {};
const realation = {};

/**
 * @changePageState 改变页面数据 仅能通过动作改变
 * 动作触发情况:
 * 1. 主动触发 --> 动作 --> changeData
 * 2. 条件触发 --> 动作 --> changeData
 *  1. table[set、update、del] --> 依赖该table的动作 --> 满足触发条件「动作的上层依赖、满足apbdsl触发条件、输出的下层影响、动作上下文影响?」 --> 触发table[get]
 *  2. 跨页面影响「有导出和使用才有」/页面数据实际更新  --> 触发的影响
 *
 * @getPageState 获取页面数据
 *
 * 1. props中使用
 * 2. 动作执行过程中获取 「注意: 流程执行不能获取数据」
 * 3. 跨页面穿值
 */

/** 可行, 好像不知道路径? */
/** 重要: 链路问题? */
/** 如果用proxy好多都要重做 */
// const handle = {
//   get(target, property, receiver) {
//     console.log(target, property, receiver);
//     // return target[property];
//     return Reflect.get(target, property);
//   },
//   set(target, property, value, receiver) {
//     // target[property ] = value;
//     console.log(target, property, value, receiver);
//     return Reflect.set(target, property, value);
//   }
// };

// const sy1 = Symbol('a');
// const sy2 = Symbol('a');
// const cy = {
//   [sy1]: 1,
//   [sy2]: 2,
// };

// const pry = new Proxy({
//   a: sy1,
//   b: sy2
// }, {
//   get(target, property) {
//     const syy = Reflect.get(target, property);
//     return cy[syy];
//   },
//   set(target, property, value, receiver) {
//     // target[property ] = value;
//     console.log(target, property, value, receiver);
//     return Reflect.set(target, property, value);
//   }
// });

/** 先从收集开始 */
/**
 * 1. jsonP的路径?
 */

// const vc = new Proxy({
//   c: 1
// }, handle);
// const v = new Proxy([1, 2, vc], handle);

// const bb = new Proxy({
//   a: 1,
//   v,
//   d: {
//     s: 1,
//     c: [13, 4]
//   }
// }, handle);

/** Dependency injection / Depend */

interface A {
  /** json的路径 */
  path: '',
  /** json的key */
  key: '';
  /** 实际获取值的引用 */
  refValue: '';
}

type C = 'get' | 'set';

/** 元数据是模型, 状态是实际数据 */
interface ActionDepend {
  /** 动作依赖的页面状态 */
  schemas: [],
  /** 动作依赖的元数据 */
  metadate: [],
}

interface ActionEffect {
  /** 动作影响的页面状态 */
  schemas: [],
  /** 动作影响的元数据 */
  metadate: [],

}

interface PropsDepend {
  /** 属性依赖的页面状态 */
  schemas: [],
  /** 属性依赖的元数据 */
  metadate: [],
}
