import React from 'react';
import { TextareaComp } from '.';
import { BusinessWidgetAccessSpec } from '../../interfaces';

export const Textarea: BusinessWidgetAccessSpec = () => ({
  name: 'Textarea',

  editableProps: {
    title: 'string',
    labelColor: 'string',
    defValue: 'string',
  },

  render(widgetState) {
    return (
      <TextareaComp {...widgetState} />
    );
  }
});
