import React from 'react';

import {
  Input
} from "@infra/ui-interface";

/**
 * 解析 DSL 描述的 component
 */
const componentParser = (component) => {
  const { type } = component;
  switch (type) {
    case 'Input':
      return <Input />;
    default:
      break;
  }
};

export default componentParser;
