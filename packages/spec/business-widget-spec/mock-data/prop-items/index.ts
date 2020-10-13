import { PropItemsCollection } from "@engine/visual-editor/data-structure";
import * as PropItemComps from "../../PropItems";
import { ApiMock } from "../api-mock";

// const createObj = <T extends (new())>(C: T): T => new C();

/**
 * TODO: 搞清楚属性如何影响组件实例，或者是说组件实例如何根据属性数据进行调整
 */
export const propItemsCollection: PropItemsCollection = {
  prop_field: PropItemComps.FieldHelperSpec,
  prop_real_value: PropItemComps.ValueHelperSpec,
  prop_style_title_color: PropItemComps.TitleColorHelperSpec,
  prop_title_value: PropItemComps.TitleHelperSpec,
  prop_flex_config: PropItemComps.ColumnHelperSpec,
};

export const getPropItemData = ApiMock(propItemsCollection);
