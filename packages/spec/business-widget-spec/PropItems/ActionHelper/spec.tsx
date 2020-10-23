import React from 'react';
import { Input, ShowModal } from '@infra/ui';
import { PropItemCompAccessSpec } from '@engine/visual-editor/data-structure';
import { ActionSettingPanel } from './ActionSettingPanel';

export const ActionHelperSpec: PropItemCompAccessSpec = {
  id: 'prop_action_config',

  label: '动作设置',

  whichAttr: ['actionRef'],

  useMeta: {
    actions: true
  },

  render(ctx) {
    const {
      takeMeta, genMetaRefID, changeEntityState, changePageMeta,
      widgetEntityState, interDatasources
    } = ctx;
    const metaRefID = widgetEntityState.actionRef || genMetaRefID('actions');
    const actionConfig = takeMeta({
      metaAttr: 'actions',
      metaRefID
    });

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
                  <ActionSettingPanel
                    interDatasources={interDatasources}
                    defaultConfig={actionConfig}
                    onSubmit={(actionSetting) => {
                      console.log('actionSetting :>> ', actionSetting);
                      changeEntityState({
                        attr: 'actionRef',
                        value: metaRefID
                      });
                      changePageMeta({
                        data: actionSetting,
                        metaAttr: 'actions',
                        dataRefID: metaRefID
                      });
                      close();
                    }}
                  />
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
