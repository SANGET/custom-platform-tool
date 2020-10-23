import { ShowModal, ShowModalParams } from '@deer-ui/core/modal/modal-func';
import React from 'react';

export interface PopModelSelectorProps {
  modelSetting: ShowModalParams
}

export const PopModelSelector: React.FC<PopModelSelectorProps> = ({
  modelSetting,
  children
}) => {
  return (
    <div
      className="px-4 py-2 border cursor-pointer"
      onClick={(e) => {
        ShowModal(modelSetting);
      }}
    >
      {children}
    </div>
  );
};
