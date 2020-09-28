import React from 'react';

import { Input } from '@infra/ui';
import { PropItemCompAccessSpec } from '../../interfaces';

export class NormalInputSpec implements PropItemCompAccessSpec {
  name = 'NormalInput'

  render(props, onChangeState) {
    return (
      <Input
        {...props}
        onChange={(val) => {
          onChangeState(val);
        }}
      />
    );
  }
}
