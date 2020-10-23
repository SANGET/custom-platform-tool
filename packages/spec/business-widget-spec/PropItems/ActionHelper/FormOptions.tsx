import React from 'react';
import { FormLayout } from '@deer-ui/core/form-layout';
import { FormOptions } from '@deer-ui/core/form-generator/form-generator';
import { PopModelSelector } from '@infra/ui';
import { PageSelectorLite } from './PageSelectorLite';

const actionTypes = [
  {
    value: 'submit',
    text: '库表操作(数据提交)'
  },
  {
    value: 'openPage',
    text: '打开页面'
  },
];
export const actionConfigForm = ({
  config,
  interDatasources
}): FormOptions => [
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
      const { value: actionVal, values } = ctx;
      // console.log('values :>> ', values);
      const { triggerAction } = values;
      let formOptionsForActionSetting;
      switch (triggerAction) {
        case 'submit':
          formOptionsForActionSetting = createActionForm(interDatasources);
          break;
        case 'openPage':
          formOptionsForActionSetting = openPageForm(interDatasources);
          break;
      }
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
                  formOptions={formOptionsForActionSetting}
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
];

export const openPageForm = (): FormOptions => [
  {
    ref: 'pageType',
    type: 'radio',
    title: '页面类型',
    values: {
      create: '新增',
      update: '更新',
      readonly: '只读',
    }
  },
  {
    ref: 'pageID',
    type: 'customForm',
    title: '选择页面',
    render: () => {
      return (
        <PageSelectorLite
          onSelect={(selectRow) => {
            console.log('selectRow', selectRow);
          }}
        />
      );
    }
  }
];

/**
 * 将内部的数据源转换成 radio 的 values
 * @param interDatasources
 */
export const convertDatasource2RadioValues = (interDatasources: PD.Datasources) => {
  const res = {};
  interDatasources.forEach((ds) => {
    const { id, name } = ds;
    res[id] = name;
  });
  return res;
};

export const createActionForm = (interDatasources): FormOptions => [
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
      // TODO: 先完成页面和控件变量
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
];
