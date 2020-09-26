import React from 'react';

import { Input } from '@infra/ui';
import { PropItemCompAccessSpec } from '../../interfaces';

export default class PropItemInput implements PropItemCompAccessSpec {
  render(props) {
    return (
      <Input {...props} />
    );
  }
}
