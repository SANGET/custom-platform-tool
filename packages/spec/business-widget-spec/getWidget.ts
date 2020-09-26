import { BusinessWidgetAccessSpec } from './interfaces';
import FormInputSpec from './Widgets/FormInput';

export const getWidget = (widgetType: string): BusinessWidgetAccessSpec => {
  return new FormInputSpec();
};
