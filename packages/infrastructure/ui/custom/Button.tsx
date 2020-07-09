import React from 'react';

import { Button } from '@deer-ui/core';
import { ButtonProps2 } from '@deer-ui/core/button/button';
import { FormComponent, basicComponentFac } from '../basic';

type CustomInputComponent = FormComponent

type a = React.FC<ButtonProps2>

export const CustomButton = basicComponentFac(Button);

const CustomButtonDemo = (props: CustomInputComponent) => {
  return (
    <>
      <CustomButton color="black" />
      <Button color="" />
    </>
  );
};
