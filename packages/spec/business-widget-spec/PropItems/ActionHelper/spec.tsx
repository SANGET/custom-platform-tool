import React from 'react';
import { PopModelSelector } from '@infra/ui';
import { PropItemCompAccessSpec } from '@engine/visual-editor/data-structure';
import { ActionSettingPanel } from './ActionSettingPanel';

const whichAttr = 'actionRef';

const metaAttr = 'actions';

export const ActionHelperSpec: PropItemCompAccessSpec = {
  id: 'prop_action_config',

  label: '动作设置',

  whichAttr,

  useMeta: metaAttr,

  render(ctx) {
    const {
      takeMeta, genMetaRefID, changeEntityState, changeMetadata,
      editingWidgetState, businessPayload
    } = ctx;
    const { interDatasources } = businessPayload;
    const metaRefID = editingWidgetState[whichAttr] || genMetaRefID(metaAttr);
    const actionConfig = takeMeta({
      metaAttr,
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
                      attr: whichAttr,
                      value: metaRefID
                    });
                    changeMetadata({
                      data: actionSetting,
                      metaAttr,
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
