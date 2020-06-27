type ComponentTypes = 'Input' | 'Selector'

export interface ComponentItemBindPropsConfig {
  type: ComponentTypes
  id: string
  /** 最外层的 tab 分组 */
  propsCatagroyGroup: ({
    title: string
    id: string
    /** 每个 tab 下的小分组 */
    propsListGroup: ({
      title: string
      /** 最小属性单元 */
      items: ({
        id: string
      })[]
    })[]
  })[]
}
