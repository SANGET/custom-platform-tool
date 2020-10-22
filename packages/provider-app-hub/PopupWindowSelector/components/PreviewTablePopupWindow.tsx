/* eslint-disable no-nested-ternary */
import React, { useState, useEffect } from 'react';
import {
  Button, Form, Input, Select, InputNumber, message, notification
} from 'antd';
import { FormInstance } from 'antd/lib/form';
import {
  SHOW_TYPE_OPTIONS, SELECT_TYPE_OPTIONS, SHOW_TYPE, SPECIES, SELECT_TYPE, IPopupWindow, IModalData
} from '../constant';
import {
  NameCodeItem, ModuleTreeItem, PrimaryTreeItem, FromFooterBtn
} from "./FormItem";
import CreateMenu from './CreateMenu';
import { createPopupWindowService, editPopupWindowService } from '../service';
import './index.less';
import CreateModal from './CreateModal';
import { PopupWindowTable } from './PopupWindowTable';
import { PopupWindowField } from './PopupWindowField';

const { Option } = Select;
const { TextArea } = Input;

interface IProps {
  onOk: () => void;
  onCancel: () => void;

  upDataMenus: () => void;

  previewData:IPopupWindow
  previewModalData: IModalData

}
const layout = {
  labelCol: { span: 5 },
  wrapperCol: { span: 19 },
};
const PreviewPopupWindow: React.FC<IProps> = (props: IProps) => {
  const {
    onCancel, onOk, upDataMenus, previewData: {
      id, name, selectType, showType
    }, previewModalData: { okText }
  } = props;
  console.log(props);
  const [form] = Form.useForm();
  const [visibleModal, setVisibleModal] = useState<boolean>(false);

  const handleMenuOk = () => {
    setVisibleModal(false);
    upDataMenus && upDataMenus();
  };
  const handleFormCancel = () => {
    onCancel && onCancel();
  };
  useEffect(() => {
    form.setFieldsValue({ name, showType, selectType });
  }, []);

  return (
    <><span>abcd</span>
      <CreateModal
        title={okText}
        modalVisible={visibleModal}
        onCancel={() => setVisibleModal(false)}
      >
        <CreateMenu
          onCancel={() => setVisibleModal(false)}
          onOk={handleMenuOk}
        />
      </CreateModal>
    </>
  );
};
export default React.memo(PreviewPopupWindow);
