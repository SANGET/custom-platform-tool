/** TODO: 完善 */
export interface PropertyItemConfig {
  label: string
  component: {
    type: 'Input'
  }
}

export interface PropertiesItemCollection {
  [propID: string]: PropertyItemConfig
}
