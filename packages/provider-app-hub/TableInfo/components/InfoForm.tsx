import React from "react";
import {
  Form, Input, Select, Col, Row
} from 'antd';
import { FormInstance } from '../interface';
import { ModuleTreeItem } from './ModuleTreeItem';
import { TABLE_TYPE, RE, TABLE_TYPE_CN } from '../constant';

interface IProps {
  getFieldValue: (param: string) => string | null
}
/** 归属模块 */
const ModuleId: React.FC<IProps> = React.memo((props: IProps) => {
  const { getFieldValue } = props;
  const val = getFieldValue?.('moduleId');
  return val ? (
    <Form.Item
      name="moduleId"
      label="归属模块"
    >
      <ModuleTreeItem initialValue={val}/>
    </Form.Item>
  ) : null;
});

/** 主表名称 */
const MainTableName: React.FC<IProps> = React.memo((props: IProps) => {
  const { getFieldValue } = props;
  const val = getFieldValue('type');
  return val === TABLE_TYPE?.AUX_TABLE ? (
    <Form.Item
      name="mainTableName"
      label="主表名称"
    >
      <Input disabled />
    </Form.Item>
  ) : null;
});

interface IInfoFormProps {
  form: FormInstance
}
/**
 * 头部表单组件
 */
export const InfoForm: React.FC<IInfoFormProps> = React.memo((props: IInfoFormProps) => {
  const { form } = props;
  const layout = {
    labelCol: { span: 8 },
    wrapperCol: { span: 16 },
  };
  return (
    <Form {...layout} form={form}>
      <Row className="margin-blr10" justify="space-between">
        <Col span={5}>
          <Form.Item
            name="name"
            label="数据表名称"
            rules={[
              { required: true, message: '数据表名称不能为空' },
              { pattern: RE?.CENUSB, message: '输入字段可以为中文、英文、数字、下划线、括号' },
              { max: 64, message: '最多只能输入64个字符' },
            ]}
          >
            <Input/>
          </Form.Item>
        </Col>
        <Col span={5}>
          <Form.Item
            name="code"
            label="数据表编码"
          >
            <Input disabled/>
          </Form.Item>
        </Col>
        <Col span={4}>
          <Form.Item
            name="type"
            label="表类型"
          >
            <Select
              disabled options={[
                { label: TABLE_TYPE_CN?.TABLE, value: TABLE_TYPE?.TABLE },
                { label: TABLE_TYPE_CN?.TREE, value: TABLE_TYPE?.TREE },
                { label: TABLE_TYPE_CN?.AUX_TABLE, value: TABLE_TYPE?.AUX_TABLE },
              ]}
            />
          </Form.Item>
        </Col>
        <Col span={5}>
          <Form.Item
            noStyle
            shouldUpdate={(prevValues, currentValues) => prevValues?.type !== currentValues?.type}
          >
            <ModuleId getFieldValue = {form?.getFieldValue}/>
          </Form.Item>
        </Col>
        <Col span={5}>
          <Form.Item
            noStyle
            shouldUpdate={(prevValues, currentValues) => prevValues?.type !== currentValues?.type}
          >
            <MainTableName getFieldValue = {form?.getFieldValue}/>
          </Form.Item>
        </Col>
      </Row>
    </Form>
  );
});
