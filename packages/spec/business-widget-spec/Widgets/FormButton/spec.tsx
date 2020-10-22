import React from 'react';
import { FormButtonComp } from '.';
import { BusinessWidgetAccessSpec } from '../../interfaces';

export const FormButton: BusinessWidgetAccessSpec = () => ({
  name: 'FormButton',

  editableProps: {
    title: 'string',
  },

  render(widgetState) {
    const { title } = widgetState;
    return (
      <FormButtonComp
        text={title}
        onClick={() => {
          console.log('click');
        }}
      />
    );
  }
});
