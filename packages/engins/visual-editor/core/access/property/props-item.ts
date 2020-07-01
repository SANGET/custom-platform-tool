/** TODO: 完善 */
export interface PropertyItem {
  label: string
  type: string
  component: {
    type: 'Input'
  }
}

export type PropertyItemConfig = ((entity) => PropertyItem) | PropertyItem

export interface PropertiesItemCollection {
  [propID: string]: PropertyItemConfig
}
