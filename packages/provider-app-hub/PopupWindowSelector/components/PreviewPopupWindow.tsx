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
import PreviewTablePopupWindow from './PreviewTablePopupWindow';

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
  const [form] = Form.useForm();
  const [visibleModal, setVisibleModal] = useState<boolean>(false);
  const handleFinish = async (values) => {
    if (!id) {
    // const params = assemblyParams(values);
      const params = assemblyPopupParams(values);
      const res = await createPopupWindowService(params);
      if (res.code === "00000") {
        notification.success({
          message: "新增成功",
          duration: 2
        });
        onOk && onOk();
      } else {
        message.error(res.msg);
      }
    } else {
      // const params = assemblyParams(values);
      const params = assemblyPopupParams(values);
      const res = await editPopupWindowService(params, id);
      if (res.code === "00000") {
        notification.success({
          message: "编辑成功",
          duration: 2
        });
        onOk && onOk();
      } else {
        message.error(res.msg);
      }
    }
  };
  /**
   * 创建表接口参数拼装
   * @param values
   */
  const assemblyParams = (values) => {
    const {
      name, code, type, moduleId, description, mainTableCode, maxLevel
    } = values;
    const params = {
      name,
      code,
      type,
      moduleId,
      description,
      species: SPECIES.BIS,
    };
    if (type === SHOW_TYPE.TABLE) {
      Object.assign(params, { auxTable: { mainTableCode } });
    }
    if (type === SHOW_TYPE.TREE) {
      Object.assign(params, { treeTable: { maxLevel } });
    }
    return params;
  };

  const assemblyPopupParams = (values) => {
    const {
      name, showType, selectType, datasource, datasourceType, returnValue, returnText
    } = values;

    const params = {
      name,
      showType,
      selectType,
      selectCount: 0,
      enable: 1,
      tablePopupWindowDetail: {
        popupWindowId: 1234,
        datasource,
        datasourceType: 'DB',
        returnValue,
        returnText,
        sortColumnInfo: 'STR1',
        showColumn: 'STR2',
      }
    };

    return params;
  };

  const createModule = () => {
    setVisibleModal(true);
  };

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
    <>
      <PreviewTablePopupWindow {...props}></PreviewTablePopupWindow>
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
