import React, { useState } from 'react';
import {
  ShowModal, Button, Input, CloseModal
} from '@infra/ui';

const FXContent = ({
  onSave
}) => {
  const [inputVal, setInputVal] = useState();
  return (

    <div>
      <Input
        onChange={(val) => {
          setInputVal(val);
        }}
      />
      <Button
        onClick={() => {
          onSave(inputVal);
        }}
      >
        保存
      </Button>
    </div>
  );
};

export const FXContainer = ({
  onChange
}) => {
  return (
    <span
      className="link-btn"
      onClick={(e) => {
        const modalID = ShowModal({
          title: '表达式支持',
          children: () => {
            return (
              <FXContent onSave={(val) => {
                onChange(val);
                CloseModal(modalID);
              }}
              />
            );
          }
        });
      }}
    >
      useFx
    </span>
  );
};
