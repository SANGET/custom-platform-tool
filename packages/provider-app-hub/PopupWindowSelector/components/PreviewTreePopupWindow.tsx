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

  editData:IPopupWindow
  editModalData: IModalData

}
const layout = {
  labelCol: { span: 5 },
  wrapperCol: { span: 19 },
};
const PreviewPopupWindow: React.FC<IProps> = (props: IProps) => {
  const {
    onCancel, onOk, upDataMenus, editData: {
      id, name, selectType, showType
    }, editModalData: { okText }
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
    // const params = {
    //   name: 'abcd',
    //   showType: 1,
    //   selectType: 1,
    //   selectCount: 0,
    //   enable: 1,
    //   tablePopupWindowDetail: {
    //     popupWindowId: 1234,
    //     datasource: 4567,
    //     datasourceType: 'DB',
    //     returnValue: 2233,
    //     returnText: 4455,
    //     sortColumnInfo: 'STR1',
    //     showColumn: 'STR2',
    //   }
    // };

    // const params = {
    //   name: 'abcd',
    //   showType: 1,
    //   selectType: 1,
    //   selectCount: 0,
    //   enable: 1,
    //   tablePopupWindowDetail: {
    //     popupWindowId: 1234,
    //     datasource: 4567,
    //     datasourceType: 'DB',
    //     returnValue: 2233,
    //     returnText: 4455,
    //     sortColumnInfo: 'STR1',
    //     showColumn: 'STR2',
    //   }
    // };

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

    console.log(params);

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
      <Form {...layout} form={form} name="control-hooks" onFinish={handleFinish}>
        <NameCodeItem form={form} />
        <Form.Item
          name="showType"
          label="显示类型"
          rules={[{
            required: true,
            message: "请选择显示类型"
          }]}
        >
          <Select
            placeholder="请选择显示类型"
          >
            {
              SHOW_TYPE_OPTIONS.map((item, index) => <Option
                key={index} value={item.value}
              >{item.title}</Option>)
            }
          </Select>
        </Form.Item>
        <Form.Item
          name="selectType"
          label="选择类型"
          rules={[{
            required: true,
            message: "请选择选择类型"
          }]}
        >
          <Select
            placeholder="请选择选择类型"
          >
            {
              SELECT_TYPE_OPTIONS.map((item, index) => <Option
                key={index} value={item.value}
              >{item.title}</Option>)
            }
          </Select>
        </Form.Item>
        <Form.Item
          noStyle
          shouldUpdate={(prevValues, currentValues) => prevValues.showType !== currentValues.showType}
        >
          {({ getFieldValue }) => {
            return getFieldValue('showType') === SHOW_TYPE.TREE
              ? (
                <Form.Item
                  name="maxLevel"
                  label="最大层级数1"
                  rules={[{
                    required: true,
                    message: "请填写最大层级数1"
                  }]}
                  initialValue={15}
                >
                  <InputNumber placeholder="须为正整数,最大层级不超过15级" min={2} max={15} />
                </Form.Item>
              ) : getFieldValue('showType') === SHOW_TYPE.TABLE ? (
                <PrimaryTreeItem />
              ) : null;
          }}
        </Form.Item>
        <PopupWindowTable
          form={form}
          label="数据源"
          text = 'datasource'
        />
        <PopupWindowField
          label = "返回值"
          code='returnValue'
          form={form}
          name="returnValue"
          text = 'returnValue'

        />
        <PopupWindowField
          label = "返回文本"
          code='returnText'
          form={form}
          name="returnText"
          text = 'returnText'
        />
        <ModuleTreeItem />
        <Button
          type="link"
          className="create-link"
          onClick={createModule}
        >新建模块</Button>
        <Form.Item name="description" label="备注" >
          <TextArea rows={4} maxLength={100} />
        </Form.Item>
        <FromFooterBtn
          onCancel={handleFormCancel}
          okText={okText}
        />
      </Form>
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
