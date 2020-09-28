import React from 'react';
import { Button, Col, Row } from 'antd';

interface IProps {
}
/** 头部栏的确定、取消按钮 */
export const SaveOrCancel: React.FC<IProps> = React.memo((props: IProps) => {
  /** 点击确定 */
  const handleSave = () => {

  };
  /** 点击取消 */
  const handleCancel = () => {

  };
  return (
    <Row className="save-or-cancel margin-blr10">
      <Col span={24} style={{ textAlign: 'right' }}>
        <Button
          type="primary"
          onClick={handleSave}
        >确定</Button>
        <Button htmlType="button" onClick={handleCancel}>
        取消</Button>
      </Col>
    </Row>
  );
});
