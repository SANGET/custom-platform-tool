import React, { Fragment } from 'react';

import {
  TootipFactory, TableFactory,
  BaseInputFactory, FormItemFactory,
  ErrorFactory
} from '.';
import { AllUI } from './types';

/** widget权限控制演示 */
const AuthTootipFactory = ({ children, ...props }) => {
  return Math.random() > 0.3
    ? (<TootipFactory {...props} children={children} />)
    : (<Fragment>{[...children, 'tips无权限']}</Fragment>);
};

const allWidgetList = {
  [AllUI.FormItem]: FormItemFactory,
  [AllUI.Tootip]: TootipFactory,
  // [AllUI.Tootip]: AuthTootipFactory,
  [AllUI.BaseInput]: BaseInputFactory,
  [AllUI.Error]: ErrorFactory,
  [AllUI.NormalTable]: TableFactory
};

/** uitls: 获取真实组件 */
const getWidget = (
  compTag: AllUI
) => allWidgetList[compTag];
export { getWidget };
