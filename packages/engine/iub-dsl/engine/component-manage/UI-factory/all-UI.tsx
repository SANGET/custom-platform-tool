import React, { Fragment } from 'react';

import {
  TootipFactory, TableFactory,
  NormalInputFactory, FormItemFactory,
  ErrorFactory,
  NormalButtonFactory
} from '.';
import { AllUI } from './types';

/** widget权限控制演示 */
// const AuthTootipFactory = ({ children, ...props }) => {
//   return Math.random() > 0.3
//     ? (<TootipFactory {...props} children={children} />)
//     : (<Fragment>{[...children, 'tips无权限']}</Fragment>);
// };

const allWidgetList = {
  [AllUI.FormItem]: FormItemFactory,
  [AllUI.Tootip]: TootipFactory,
  // [AllUI.Tootip]: AuthTootipFactory,
  [AllUI.NormalInput]: NormalInputFactory,
  [AllUI.WidgetError]: ErrorFactory,
  [AllUI.NormalTable]: TableFactory,
  [AllUI.NormalButton]: NormalButtonFactory,
};

/** uitls: 获取真实组件 */
const getWidget = (
  compTag: AllUI
): React.FC<any> => allWidgetList[compTag];
export { getWidget };
