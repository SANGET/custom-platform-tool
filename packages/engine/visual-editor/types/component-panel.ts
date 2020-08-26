export interface PanelItemsGroup {
  title: string
  items: string[]
}

export interface PanelTabGroupItem {
  title: string
  itemsGroups: PanelItemsGroup[]
}

export interface ComponentPanelConfig {
  tabGroup: PanelTabGroupItem[]
}
