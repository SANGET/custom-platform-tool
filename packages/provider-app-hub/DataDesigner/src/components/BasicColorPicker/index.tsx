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
     margin-fontColor:10px
   }
`;

/**
* 基本颜色选择器
*/
const BasicColorPicker = (props) => {
  const {
    modalProps, onLeftChangeComplete, onRightChangeComplete, color
  } = props;

  const { fontColor, bgColor } = color;
  return (
    <Modal {...modalProps}>
      <PickerStyled className={'flex'}>
        <div>
          <h5>文本颜色</h5>
          <SketchPicker {...{ color: fontColor, onChangeComplete: onLeftChangeComplete }} width="280px" />
        </div>
        <div>
          <h5>背景颜色</h5>
          <SketchPicker {...{ color: bgColor, onChangeComplete: onRightChangeComplete }} width="280px" />
        </div>
      </PickerStyled>
    </Modal>
  );
};

const BasicColor = (props) => {
  const { color, onClick } = props;
  return <div onClick={ onClick} style={{ width: '20px', height: '20px', backgroundColor: `${color}` }}></div>;
};
export default BasicColorPicker;
export { BasicColor };
