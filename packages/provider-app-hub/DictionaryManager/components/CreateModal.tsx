import React from 'react';
import { Modal } from 'antd';

interface IProps {
  modalVisible: boolean;
  onCancel: () => void;

  title: string;
  children?: React.ReactElement;
  width?: string
}

const CreateModal: React.FC<IProps> = (props) => {
  const {
    modalVisible, onCancel, title, width = '600px'
  } = props;

  return (
    <Modal
      width={width}
      className="create-dictionary-modal"
      destroyOnClose
      title={title}
      visible={modalVisible}
      onCancel={() => onCancel && onCancel()}
      footer={null}
      okText="确认"
      maskClosable={false}
      cancelText="取消"
    >
      {props.children}
    </Modal>
  );
};

export default React.memo(CreateModal);
