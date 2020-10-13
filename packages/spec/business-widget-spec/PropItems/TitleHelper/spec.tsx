import React from 'react';
import { PropItemCompAccessSpec } from '@engine/visual-editor/data-structure';

export const TitleHelperSpec: PropItemCompAccessSpec = () => ({
  id: 'prop_title_value',

  label: '标题',

  whichAttr: 'title',

  defaultValue: 'label',

  render() {
    return (
      <div></div>
    );
  }
});
