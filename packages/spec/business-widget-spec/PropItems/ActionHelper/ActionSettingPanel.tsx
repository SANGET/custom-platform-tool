import React from 'react';
import {
  Input, Radio, Switch, ShowModal
} from '@infra/ui';
import { FormLayout } from '@deer-ui/core/form-layout';
import update from 'immutability-helper';

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
}

const actionTypes = [
  {
    value: 'submit',
    text: '库表操作(数据提交)'
  },
  {
    value: 'openLink',
    text: '打开连接'
  },
];

const DefaultActionSetting = {
  event: 'onClick',
  triggerAction: 'submit',
  preTrigger: '',
  action: '',
  condition: ''
};

const ActionConfigItem: React.FC<ActionConfigItemProps> = ({
  onChange,
  config
}) => {
  return (
    <div className="card-item p-4">
      <Radio
        values={actionTypes}
        onChange={(val) => {
          config.triggerAction = val;
          onChange(config);
        }}
      />
      <div
        onClick={(e) => {
          ShowModal({
            title: '动作配置',
            children: () => {
              return (
                <FormLayout
                  formBtns={[
                    {
                      actingRef: 'submitting',
                      action: (formRef) => {
                        const { value } = formRef;
                        console.log('value', value);
                      },
                      text: '提交'
                    }
                  ]}
                  formOptions={[
                    {
                      ref: 'actionName',
                      type: 'input',
                      title: '动作名称'
                    },
                    {
                      ref: 'forEntrieTable',
                      type: 'switch',
                      title: '整表回写',
                      hints: ['是', '否']
                    },
                    // {
                    //   ref: ''
                    // }
                  ]}
                />
                // <div className="horizontal-form form-container animate-input-title">
                //   <div className="form-group">
                //     <span className="control-label">动作名称</span>
                //     <Input onChange={} />
                //   </div>
                //   <div className="form-group">
                //     <span className="control-label">整表回写</span>
                //     <Switch
                //       checked={false}
                //       hints={['是', '否']}
                //       onChange={(e) => {

              //       }}
              //     />
              //   </div>
              // </div>
              );
            }
          });
        }}
      >配置动作</div>
    </div>
  );
};

export const ActionSettingPanel: React.FC<{}> = (props) => {
  const [actionSetting, setActionSetting] = React.useState([DefaultActionSetting]);
  const setActionItem = (config, idx) => {
    const addNextState = update(actionSetting, {
      $splice: [
        [idx, 1, config],
      ],
    });
    setActionSetting(addNextState);
  };
  return (
    <div className="flex card-container p-2">
      {
        actionSetting.map((actionItem, idx) => {
          return (
            <ActionConfigItem
              key={idx}
              config={{ ...actionItem }}
              onChange={(nextConfig) => {
                setActionItem(nextConfig, idx);
              }}
            />
          );
        })
      }
      <div className="card-item p-4">
        <span>添加动作</span>
      </div>
    </div>
  );
};
