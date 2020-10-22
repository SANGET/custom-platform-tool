import React from 'react';
import { Input, ShowModal } from '@infra/ui';
import { PropItemCompAccessSpec } from '@engine/visual-editor/data-structure';
import { ActionSettingPanel } from './ActionSettingPanel';

export const ActionHelperSpec: PropItemCompAccessSpec = {
  id: 'prop_action_config',

  label: '动作设置',

  whichAttr: ['action'],

  defaultValues: {
    action: '标题'
  },

  useMeta: true,

  render(ctx) {
    const { changeEntityState, widgetEntityState } = ctx;
    return (
      <div>
        <div
          className="px-4 py-2 border"
          onClick={(e) => {
            ShowModal({
              title: '设置动作',
              width: 900,
              children: ({ close }) => {
                return (
                  <ActionSettingPanel />
                );
              }
            });
          }}
        >
          设置点击动作
        </div>
      </div>
    );
  }
};
