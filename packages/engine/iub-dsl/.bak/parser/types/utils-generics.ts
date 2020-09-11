/** Partial的作用就是将传入的属性变为可选。 */
export type Partial<T> = { [P in keyof T]?: T[P] };

/** Required 的作用是将传入的属性变为必选项 */
export type Required<T> = { [P in keyof T]-?: T[P] };

/** 将传入的属性变为只读选项 */
export type Readonly<T> = { readonly [P in keyof T]: T[P] };

/** 该类型可以将 K 中所有的属性的值转化为 T 类型 */
export type Record<K extends keyof any, T> = { [P in K]: T; };

/** 从 T 中取出 一系列 K 的属性 */
export type Pick<T, K extends keyof T> = { [P in K]: T[P]; };

/** Exclude 将某个类型中属于另一个的类型移除掉。 */
export type Exclude<T, U> = T extends U ? never : T;

/** Extract 的作用是提取出 T 包含在 U 中的元素，换种更加贴近语义的说法就是从 T 中提取出 U */
export type Extract<T, U> = T extends U ? T : never;

/** Pick 和 Exclude 进行组合, 实现忽略对象某些属性功能 */
export type Omit<T, K extends keyof any> = Pick<T, Exclude<keyof T, K>>;

/** 默认解析返回字符串 */
export type DefaultParserFn<T> = (s: T) => string
