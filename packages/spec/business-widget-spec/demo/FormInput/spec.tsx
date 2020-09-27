import React from 'react';
import { FormInputComp } from '.';
import { BusinessWidgetAccessSpec } from '../../interfaces';

export class FormInputSpec implements BusinessWidgetAccessSpec {
  name = 'FormInput'

  render(widgetState) {
    return (
      <FormInputComp {...widgetState} />
    );
  }
}
