import { WidgetEntityState, PropItemMeta } from "../../data-structure";

export type UpdateEntityStateCallback = (
  propItemMeta: PropItemMeta,
  value: any,
) => void
