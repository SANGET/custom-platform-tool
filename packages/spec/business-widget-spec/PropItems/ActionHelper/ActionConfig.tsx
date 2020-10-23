import React from 'react';
import { FormLayout } from '@deer-ui/core/form-layout';

export const ActionConfig = ({
  actionConfig
}) => {
  return (

    <FormLayout
      defaultValues={actionConfig}
      formBtns={[
        {
          actingRef: 'submitting',
          action: (formRef) => {
            const { value } = formRef;
            config.action = value;
            onChange(config);
            setActionConfig(value);
            close();
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
        {
          ref: 'type',
          type: 'radio',
          title: '操作类型',
          defaultValue: 'create',
          values: {
            create: '新增'
          }
        },
        {
          ref: 'targetTable',
          type: 'radio',
          title: '目标数据表',
          values: {}
        },
        {
          ref: 'firld',
          type: 'radio',
          title: '字段值',
          values: {}
        }
      // {
      //   ref: ''
      // }
      ]}
    />
  );
};
