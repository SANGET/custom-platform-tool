import React from 'react';
import { Modal } from 'antd';

import styled from 'styled-components';
import { SketchPicker } from 'react-color';

const PickerStyled = styled.div`
  /** 颜色选择器容器样式模拟 */
  border: 1px solid #d9d9d9;
  height: 32px;
  display: flex;
  justify-content: center;
  align-items: center;
  /** 颜色选择器容器-色块 */
  .color-block{
    width:20px;
    height:20px;
    border: 1px solid #d9d9d9;
  }  
`;

/**
 * 基本颜色选择器
 * @param modalProps-颜色选择器弹窗标题和显隐控制
 * @param onChangeComplete-颜色选择器改变触发事件回调
 * @param color-回显上次操作选中的颜色
 * @param selectRowIndex-正在选择的行号
 *
 */
const BasicColorPicker = ({
  modalProps, onChangeComplete, color, selectRowIndex
}) => {
  return (
    <Modal {...modalProps}>
      <SketchPicker {...{ color, onChangeComplete: (e) => { onChangeComplete(e, selectRowIndex); } }} width="350px"/>
    </Modal>
  );
};

/**
 * 颜色选择器弹窗触发容器
 * @param color-设置的颜色值
 * @param onClick-点击事件回调-打开颜色选择器
 */
const BasicColor = ({ color, onClick }) => {
  console.log(color,'color000000')
  return (<PickerStyled onClick={ onClick}>
    <div className="color-block" style={{ backgroundColor: `${color}` }}></div>
  </PickerStyled>);
};
export default BasicColorPicker;
export { BasicColor };
