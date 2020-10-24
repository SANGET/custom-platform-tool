/* eslint-disable no-nested-ternary */
import React, { useState, useEffect } from 'react';
import {
  Button, Form, Input, Select, InputNumber, message, notification
} from 'antd';
import { FormInstance } from 'antd/lib/form';
import {
  SHOW_TYPE_OPTIONS, SELECT_TYPE_OPTIONS, SHOW_TYPE, SPECIES, SELECT_TYPE, IPopupWindow, IModalData,
  IEditPopupWindowProps
} from '../constant';
import './index.less';
import CreateModal from './CreateModal';
import { PopupWindowTable } from './PopupWindowTable';
import { PopupWindowField } from './PopupWindowField';
 
const FormLeftTreeRightTable: React.FC<IEditPopupWindowProps> = (props: IEditPopupWindowProps) => {
  const {
    editData: {
      id, name, selectType, showType,treeTablePopupWindowDetail{tableDatasource, tableDatasourceType, treeDatasource,
        treeDatasourceType
      }
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
        editData = {props.editData}
        form={form}
        label="数据源"
        name = 'treeDatasource'
        code='treeDatasource'
        text = 'treeDatasource'
      />
      <PopupWindowField
        {...props}
        label = "显示字段"
        code='treeShowColumn'
        form={form}
        name="treeShowColumn"
        text = 'treeShowColumn'
      />
      <PopupWindowField
        {...props}
        label = "上级字段"
        code='treeSuperiorColumn'
        form={form}
        name="treeSuperiorColumn"
        text = 'treeSuperiorColumn'
      />
      <PopupWindowField
        {...props}
        label = "关联上级字段"
        code='treeRelatedSuperiorColumn'
        form={form}
        name="treeRelatedSuperiorColumn"
        text = 'treeRelatedSuperiorColumn'
      />
      <PopupWindowField
        {...props}
        label = "排序字段"
        code='treeSortColumnInfo'
        form={form}
        name="treeSortColumnInfo"
        text = 'treeSortColumnInfo'
      />

      <PopupWindowTable
        editData = {props.editData}
        form={form}
        label="数据源"
        name = 'tableDatasource'
        code='tableDatasource'
        text = 'tableDatasource'
      />
      <PopupWindowField
        {...props}
        label = "返回值"
        code='tableReturnValue'
        form={form}
        name="tableReturnValue"
        text = 'tableReturnValue'

      />
      <PopupWindowField
        {...props}
        label = "返回文本"
        code='tableReturnText'
        form={form}
        name="tableReturnText"
        text = 'tableReturnText'
      />
      <PopupWindowField
        {...props}
        label = "排序字段"
        code='tableSortColumnInfo'
        form={form}
        name="tableSortColumnInfo"
        text = 'tableSortColumnInfo'
      />
      <PopupWindowField
        {...props}
        label = "显示字段"
        code='tableShowColumn'
        form={form}
        name="tableShowColumn"
        text = 'tableShowColumn'
      />
    </>
  );
};
export default React.memo(FormLeftTreeRightTable);
