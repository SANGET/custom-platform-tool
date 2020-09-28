import React from 'react';
import { Row, Col, Button } from 'antd';

interface IProps {
  onCancel: ()=>void
  onOk: ()=>void
  okText: string
  cancelText: string
}
/**
 * 弹窗底部栏组件（确定，取消）
 */
export const ModalFooter: React.FC<IProps> = React.memo((props: IProps): ReactElement => {
  const {
    onCancel, onOk, okText = "确定", cancelText = "取消"
  } = props;
  return (
    <Row>
      <Col span={24} style={{ textAlign: 'right' }}>
        <Button
          onClick={onOk}
          type="primary"
          className="submit-btn"
        >
          {okText}
        </Button>
        <Button htmlType="button" onClick={onCancel}>
          {cancelText}
        </Button>
      </Col>
    </Row>
  );
});
