/* eslint-disable no-nested-ternary */
import React, { useState } from 'react';
import {
  Button, Form, Input, Select, InputNumber, message, notification
} from 'antd';
import {
  TABLE_OPTIONS, TABLE_TYPE, SPECIES, RELATION_OPTIONS, RELATION_TYPE
} from '../constant';
import {
  NameCodeItem, ModuleTreeItem, PrimaryTreeItem, FromFooterBtn
} from "./FormItem";
import CreateMenu from './CreateMenu';
import { createTableService } from '../service';
import './index.less';
import CreateModal from './CreateModal';

const { Option } = Select;
const { TextArea } = Input;

interface IProps {
  onOk: () => void;
  onCancel: () => void;

  upDataMenus: () => void;
  moduleIdDefaultValue?:string
}
const layout = {
  labelCol: { span: 5 },
  wrapperCol: { span: 19 },
};
const CreateTable: React.FC<IProps> = (props: IProps) => {
  const {
    onCancel, onOk, upDataMenus, moduleIdDefaultValue
  } = props;
  const [form] = Form.useForm();
  const [visibleModal, setVisibleModal] = useState<boolean>(false);
  const handleFinish = async (values) => {
    const params = assemblyParams(values);
    const res = await createTableService(params);
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
    if (type === TABLE_TYPE.AUX_TABLE) {
      Object.assign(params, { auxTable: { mainTableCode } });
    }
    if (type === TABLE_TYPE.TREE) {
      Object.assign(params, { treeTable: { maxLevel } });
    }
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
          name="type"
          label="表类型"
          rules={[{
            required: true,
            message: "请选择表类型"
          }]}
          initialValue={TABLE_TYPE.TABLE}
        >
          <Select
            placeholder="请选择表类型"
          >
            {
              TABLE_OPTIONS.map((item, index) => <Option
                key={index} value={item.value}
              >{item.title}</Option>)
            }
          </Select>
        </Form.Item>
        <Form.Item
          noStyle
          shouldUpdate={(prevValues, currentValues) => prevValues.type !== currentValues.type}
        >
          {({ getFieldValue }) => {
            return getFieldValue('type') === TABLE_TYPE.TREE
              ? (
                <Form.Item
                  name="maxLevel"
                  label="最大层级数"
                  rules={[
                    { required: true, message: "请填写最大层级数" },
                    { pattern: /^([2-9]|1[1-5])$/, message: "请输入2-15的整数" }
                  ]}
                  initialValue={15}
                >
                  <InputNumber />
                </Form.Item>
              ) : getFieldValue('type') === TABLE_TYPE.AUX_TABLE ? (
                <>
                  <PrimaryTreeItem
                    rules={[{
                      required: true,
                      message: "请选择主表"
                    }]}
                  />
                  <Form.Item
                    name="relationType"
                    label="关联关系"
                    rules={[{
                      required: true,
                      message: "请选择关联关系"
                    }]}
                    initialValue={RELATION_TYPE.ONE_TO_ONE}
                  >
                    <Select
                      placeholder="请选择关联关系"
                    >
                      {
                        RELATION_OPTIONS.map((item, index) => <Option
                          key={index} value={item.value}
                        >{item.title}</Option>)
                      }
                    </Select>
                  </Form.Item>
                </>
              ) : null;
          }}
        </Form.Item>
        <ModuleTreeItem defaultValue={moduleIdDefaultValue}/>
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
        title="新建模块"
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

export default React.memo(CreateTable);
