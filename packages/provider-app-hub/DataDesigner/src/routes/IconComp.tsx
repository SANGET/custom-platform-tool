/** 动态渲染图标 */
import React from 'react';
import * as Icon from '@ant-design/icons';

export default function IconComp(props) {
  return (
    /** 包裹图标的容器不能使用div，div会独占一行,把菜单文字挤压得看不到 */
    <>
      {React.createElement(Icon[props.type], {
        className: props.className,
        style: { fontSize: '16px' }
      })}
    </>
  );
}
