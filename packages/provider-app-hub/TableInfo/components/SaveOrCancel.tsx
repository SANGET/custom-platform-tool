import React from 'react';
import { Button, Col, Row } from 'antd';

interface IProps {
  canISave: boolean
  handleSave:()=>void
}
/** 头部栏的确定、取消按钮 */
export const SaveOrCancel: React.FC<IProps> = React.memo((props: IProps) => {
  const { canISave, handleSave } = props;
  /** 点击取消 */
  const handleCancel = () => {

  };
  return (
    <Row className="save-or-cancel margin-blr10">
      <Col span={24} style={{ textAlign: 'right' }}>
        <Button
          type="primary"
          onClick={handleSave}
          disabled={!canISave}
        >保存</Button>
        <Button htmlType="button" onClick={handleCancel}>
        取消</Button>
      </Col>
    </Row>
  );
});
