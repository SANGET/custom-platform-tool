import React, { useState } from 'react';
import { foo } from './template';
import './template.less';

// import {
//   Menu, Dropdown, Button, Input, Modal, Form
// } from 'antd';

function Template() {
  const [value, setValue] = useState('');
  const onClick = () => {
    foo();
    setValue('开始新功能的开发');
  };

  return (
    <article className="template" onClick={onClick}>
      {value}
    </article>
  );
}
export default Template;
