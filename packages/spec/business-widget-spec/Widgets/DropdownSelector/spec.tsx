import React from 'react';
import { DropdownSelectorComp } from '.';
import { BusinessWidgetAccessSpec } from '../../interfaces';

export const DropdownSelector: BusinessWidgetAccessSpec = () => ({
  name: 'DropdownSelector',

  render(widgetState) {
    // console.log(widgetState);
    return (
      <DropdownSelectorComp {...widgetState} />
    );
  }
});
