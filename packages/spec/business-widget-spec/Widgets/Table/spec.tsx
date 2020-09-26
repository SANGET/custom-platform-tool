import React from 'react';
import { NormalTableComp } from '.';
import { TableEditor } from '../../CustomEditor/TableEditor';
import { BusinessWidgetAccessSpec } from '../../interfaces';

export class NormalTableSpec implements BusinessWidgetAccessSpec {
  name = 'NormalTable'

  propEditor(props) {
    return (
      <TableEditor {...props} />
    );
  }

  render(widgetState) {
    return (
      <NormalTableComp {...widgetState} />
    );
  }
}
