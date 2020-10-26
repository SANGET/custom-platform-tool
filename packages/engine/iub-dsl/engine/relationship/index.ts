/**
 * TODO: 这是个大难题, 需要多尝试多思考
 */

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
 *
 * 收集 / 能被使用 /使用
 * 问题:
 * 1. 收集: 格式、储存位置
 *  1.1. 收集思路 一种结构, 一个函数, 但仅有一个提取规则 「props、action」
 *  1.2 Symbol标示/ path标示/ id标示「actionid」 问题: props怎么办? 根据comp的mark
 * 2. 能被使用: 触发动作, 导致能被使用
 *  2.1. 在动作触发的前后进行标示
 * 3. 使用: 本页面使用、跨页面
 *  3.1. 根据不同的类型, 确定如何使用
 *
 * depend「依赖」: 描述在json中哪里使用了什么
 * e.g: 在APBDSL的动作中, 在table 中使用了 test_user_k表 的元数据, 在struct[0].collectField 使用了@(schemas).entity_25
 * effectCollect「副作用收集/分析」: 动作的执行,会对XX数据造成XX影响
 * e.g: 在APBDSL的动作中, 对test_user_k表执行了insert操作, 导致了将会触发XXX副作用
 * effectAction 「副作用执行」
 * e.g: test_user_k执行了insert操作, 会对test_user_k的select操作造成影响
 *
 * 所以是不是有个动作行为分析? 或者说, 一个动作有着固定的行为, 需要对行为进行分析?
 * 行为是什么?
 * 数据: get/set
 * // 用户行为: click
 * CURDXXX表
 * 所以action本身就是一个行为的描述
 * 如果这样, 依赖和行为的关系又是什么
 * 找到哪个动作使用了test_user_k依赖, 并分析 动作是select操作则满足该动作能够触发的条件
 *
 */

export * from './effect';
