import React, {
  FC, useState, useEffect, useCallback
} from 'react';
import { Modal, Form } from 'antd';

import styled from 'styled-components';
import { SketchPicker } from 'react-color';

const PickerStyled = styled.div`
  display: flex;
  justify-content:space-between;
   & > div{
     margin-left:10px
   }
`;

/**
* 基本颜色选择器
*/
const BasicColorPicker = (props) => {
  const { modalProps, onChangeComplete, color } = props;

  return (
    <Modal {...modalProps}>
      <PickerStyled className={'flex'}>
        <div>
          <h5>文本颜色</h5>
          <SketchPicker {...{ color, onChangeComplete }} width="280px" />
        </div>
        <div>
          <h5>背景颜色</h5>
          <SketchPicker {...{ color, onChangeComplete }} width="280px" />
        </div>
      </PickerStyled>
    </Modal>
  );
};
export default BasicColorPicker;
