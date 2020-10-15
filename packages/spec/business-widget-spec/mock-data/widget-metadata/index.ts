import { WidgetTypeMetadataCollection } from "@engine/visual-editor/data-structure";
import { ApiMock } from "../api-mock";
import { FormInputMeta } from "./FormInput-meta";
import { FlexMeta } from "./Flex-meta";
import { TableMeta } from "./Table-meta";
import { CustomMeta } from "./Custom-meta";
import { DropdownSelectorMeta } from "./DropdownSelector-meta";

export const widgetMetadataCollection: WidgetTypeMetadataCollection = {
  'widget-id-1': FormInputMeta,
  'widget-id-2': FlexMeta,
  'widget-id-3': TableMeta,
  'widget-id-4': CustomMeta,
  'widget-id-5': DropdownSelectorMeta,
};

export const getWidgetDefinitionData = ApiMock(widgetMetadataCollection);
