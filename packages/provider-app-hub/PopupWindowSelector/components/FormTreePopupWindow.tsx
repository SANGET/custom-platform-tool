/* eslint-disable no-nested-ternary */
import React, { useState, useEffect } from 'react';
import {
  Button, Form, Input, Select, InputNumber, message, notification
} from 'antd';
import { FormInstance } from 'antd/lib/form';
import {
  SHOW_TYPE_OPTIONS, SELECT_TYPE_OPTIONS, SHOW_TYPE, SPECIES, SELECT_TYPE, IPopupWindow, IModalData, IEditPopupWindowProps
} from '../constant';
import './index.less';
import CreateModal from './CreateModal';
import { PopupWindowTable } from './PopupWindowTable';
import { PopupWindowField } from './PopupWindowField';

const FormTreePopupWindow: React.FC<IEditPopupWindowProps> = (props: IEditPopupWindowProps) => {
  const {
    editData: {
      id, name, selectType, showType
    }
  } = props;
  const [form] = Form.useForm();
  const [visibleModal, setVisibleModal] = useState<boolean>(false);
  const handleFinish = async (values) => {
  };

  useEffect(() => {
    form.setFieldsValue({ name, showType, selectType });
  }, []);

  return (
    <>
      <PopupWindowTable
        {...props}
        form={form}
        label="数据源"
        name = 'datasource'
        code='datasource'
        text = 'datasource'
      />
      <PopupWindowField
        {...props}
        label = "返回值"
        code='returnValue'
        form={form}
        name="returnValue"
        text = 'returnValue'

      />
      <PopupWindowField
        {...props}
        label = "返回文本"
        code='returnText'
        form={form}
        name="returnText"
        text = 'returnText'
      />
      <PopupWindowField
        {...props}
        label = "显示字段"
        code='showColumn'
        form={form}
        name="showColumn"
        text = 'showColumn'
      />
      <PopupWindowField
        {...props}
        label = "上级字段"
        code='superiorColumn'
        form={form}
        name="superiorColumn"
        text = 'superiorColumn'
      />
      <PopupWindowField
        {...props}
        label = "关联上级字段"
        code='relatedSuperiorColumn'
        form={form}
        name="relatedSuperiorColumn"
        text = 'relatedSuperiorColumn'
      />
      <PopupWindowField
        {...props}
        label = "排序字段"
        code='sortColumnInfo'
        form={form}
        name="sortColumnInfo"
        text = 'sortColumnInfo'
      />

    </>
  );
};
export default React.memo(FormTreePopupWindow);
