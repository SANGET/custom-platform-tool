/* eslint-disable no-nested-ternary */
import React, { useState } from 'react';
import {
  Button, Form, Input, Select, InputNumber, message, notification
} from 'antd';
import { SHOW_TYPE_OPTIONS, SHOW_TYPE, SPECIES } from '../constant';
import {
  NameCodeItem, ModuleTreeItem, PrimaryTreeItem, FromFooterBtn
} from "./FormItem";
import CreateMenu from './CreateMenu';
import { createPopupWindowService } from '../service';
import './index.less';
import CreateModal from './CreateModal';

const { Option } = Select;
const { TextArea } = Input;

interface IProps {
  onOk: () => void;
  onCancel: () => void;

  upDataMenus: () => void;
}
const layout = {
  labelCol: { span: 5 },
  wrapperCol: { span: 19 },
};
const CreatePopupWindow: React.FC<IProps> = (props: IProps) => {
  const { onCancel, onOk, upDataMenus } = props;
  const [form] = Form.useForm();
  const [visibleModal, setVisibleModal] = useState<boolean>(false);
  const handleFinish = async (values) => {
    // const params = assemblyParams(values);
    const params = assemblyPopupParams();
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

  const assemblyPopupParams = () => {
    const params = {
      name: 'abcd',
      showType: 1,
      selectType: 1,
      selectCount: 0,
      enable: 1,
      tablePopupWindowDetail: {
        popupWindowId: 1234,
        datasource: 4567,
        datasourceType: 'DB',
        returnValue: 2233,
        returnText: 4455,
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
          initialValue={SHOW_TYPE.TABLE}
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
        />
      </Form>
      <CreateModal
        title="新建数据表"
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

export default React.memo(CreatePopupWindow);
