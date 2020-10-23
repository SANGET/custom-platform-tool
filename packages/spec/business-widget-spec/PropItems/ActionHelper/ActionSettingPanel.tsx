import React, { useState } from 'react';
import {
  Input, Radio, Switch, ShowModal, Button, PopModelSelector
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
  interDatasources: PD.Datasources
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

const convertDatasource2RadioValues = (interDatasources: PD.Datasources) => {
  const res = {};
  interDatasources.forEach((ds) => {
    const { id, name } = ds;
    res[id] = name;
  });
  return res;
};

const ActionConfigItem: React.FC<ActionConfigItemProps> = ({
  onChange,
  interDatasources,
  config
}) => {
  return (
    <div className="card-item p-4">
      <FormLayout
        defaultValues={{ ...config }}
        formBtns={[]}
        onChange={(formVal) => {
          onChange(formVal);
        }}
        formOptions={[
          {
            ref: 'triggerAction',
            type: 'radio',
            values: actionTypes,
            title: '动作'
          },
          {
            ref: 'action',
            type: 'customForm',
            title: '配置动作',
            render: (changeCusForm, ctx) => {
              const { value: actionVal } = ctx;
              return (
                <PopModelSelector
                  modelSetting={{
                    title: '动作配置',
                    width: 800,
                    children: ({ close }) => {
                      return (
                        <FormLayout
                          defaultValues={{ ...config.action } || {}}
                          formBtns={[
                            {
                              actingRef: 'submitting',
                              action: (formRef) => {
                                const { value } = formRef;
                                // config.action = value;
                                changeCusForm(value);
                                close();
                              },
                              text: '确定'
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
                            {
                              ref: 'actionType',
                              type: 'radio',
                              title: '操作类型',
                              defaultValue: 'create',
                              values: {
                                create: '新增',
                                update: '修改',
                                del: '删除',
                              }
                            },
                            {
                              ref: 'targetTable',
                              type: 'radio',
                              title: '目标数据表',
                              values: convertDatasource2RadioValues(interDatasources)
                            },
                            {
                              ref: 'firld',
                              type: 'customForm',
                              title: '字段值',
                              render: () => {
                                return (
                                  <PopModelSelector
                                    modelSetting={{
                                      title: '设置字段值',
                                      width: 700,
                                      children: ({ close: closeS }) => {
                                        return (
                                          <div>
                                            设置字段
                                          </div>
                                        );
                                      }
                                    }}
                                  >
                                    设置字段值
                                  </PopModelSelector>
                                );
                              }
                            }
                            // {
                            //   ref: ''
                            // }
                          ]}
                        />
                      );
                    }
                  }}
                >
                  {!actionVal ? '配置动作' : '已设置动作'}
                </PopModelSelector>
              );
            }
          },
        ]}
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
