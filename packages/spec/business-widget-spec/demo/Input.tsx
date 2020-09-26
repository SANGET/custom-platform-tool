import React from 'react';
import { BusinessWidgetAccessSpec } from '../business-widget-spec';

const FormInput = () => {
  return (
    <div>Input</div>
  );
};

export default class FormInputSpec implements BusinessWidgetAccessSpec {
  render = () => <FormInput />
}
