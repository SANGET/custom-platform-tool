import {
  CreateUserPage
} from '@core/dsl/test/create-user-page';

import Input from "";

const createElement = (component) => {
  const { type } = component;
  switch (type) {
    case 'Input':
      return <Input />;
    default:
      break;
  }
};

const parser = (pageDSL) => {
  const res = pageDSL.body.map(({ component }) => {
    return createElement(component);
  });
  return res;
};

parser(CreateUserPage);

// 行为与表现分离
