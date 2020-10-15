import React from 'react';
import { FormInputComp } from '.';
import { BusinessWidgetAccessSpec } from '../../interfaces';

export const FormInput: BusinessWidgetAccessSpec = () => ({
  name: 'FormInput',

  editableProps: {
    title: 'string',
    labelColor: 'string',
    defValue: 'string',
  },

  render(widgetState) {
    return (
      <FormInputComp {...widgetState} />
    );
  }
});
