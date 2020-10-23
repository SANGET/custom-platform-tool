import React, { useState } from 'react';
import {
  Input, Radio, Switch, ShowModal, Button, PopModelSelector
} from '@infra/ui';
import { FormLayout } from '@deer-ui/core/form-layout';
import update from 'immutability-helper';
import { actionConfigForm, createActionForm } from './FormOptions';

interface ActionConfigItem {
  event: 'onClick'
  triggerAction: 'submit'
  preTrigger
  action
  condition
}

interface ActionConfigItemProps {
  config: ActionConfigItem
  onChange
  interDatasources: PD.Datasources
}

const DefaultActionSetting = {
  event: 'onClick',
  triggerAction: 'submit',
  preTrigger: '',
  action: '',
  condition: ''
};

const ActionConfigItem: React.FC<ActionConfigItemProps> = ({
  onChange,
  interDatasources,
  config
}) => {
  const { action } = config;
  const [formOptions, setFormOptions] = useState();
  return (
    <div className="card-item p-4">
      <FormLayout
        defaultValues={{ ...config }}
        formBtns={[]}
        onChange={(formVal) => {
          onChange(formVal);
        }}
        formOptions={actionConfigForm({
          config, interDatasources
        })}
      />
    </div>
  );
};

export const ActionSettingPanel: React.FC<{}> = ({
  interDatasources,
  defaultConfig = [DefaultActionSetting],
  onSubmit
}) => {
  const [actionSetting, setActionSetting] = React.useState(defaultConfig);
  const setActionItem = (config, idx) => {
    const addNextState = update(actionSetting, {
      $splice: [
        [idx, 1, config],
      ],
    });
    setActionSetting(addNextState);
  };

  return (
    <div className="bg-gray-100 px-2">
      <div className="flex card-container p-2">
        {
          actionSetting.map((actionItem, idx) => {
            return (
              <ActionConfigItem
                key={idx}
                interDatasources={interDatasources}
                config={{ ...actionItem }}
                onChange={(nextConfig) => {
                  setActionItem(nextConfig, idx);
                }}
              />
            );
          })
        }
        {/* <div className="card-item p-4">
        <span>添加动作</span>
      </div> */}
      </div>
      <div className="p-4">
        <Button
          onClick={() => {
            onSubmit(actionSetting);
          }}
        >
          确定
        </Button>
      </div>
    </div>
  );
};
