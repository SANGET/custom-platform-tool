import React from 'react';
import { Input, PopModelSelector, ShowModal } from '@infra/ui';
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
      takeMeta, genMetaRefID, changeEntityState, changeMetadata,
      editingWidgetState, businessPayload
    } = ctx;
    const { interDatasources } = businessPayload;
    const metaRefID = editingWidgetState.actionRef || genMetaRefID('actions');
    const actionConfig = takeMeta({
      metaAttr: 'actions',
      metaRefID
    });

    return (
      <div>
        <PopModelSelector
          modelSetting={{
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
                    changeMetadata({
                      data: actionSetting,
                      metaAttr: 'actions',
                      dataRefID: metaRefID
                    });
                    close();
                  }}
                />
              );
            }
          }}
        >
          设置点击动作
        </PopModelSelector>
      </div>
    );
  }
};
