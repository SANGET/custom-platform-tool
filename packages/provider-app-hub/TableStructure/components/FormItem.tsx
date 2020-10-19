import React, {
  ReactElement, useState, useEffect
} from 'react';
import {
  Button, Form, Input, TreeSelect, Row, Col
} from 'antd';
import { FormInstance } from 'antd/lib/form';
import { construct } from '@infra/utils/tools';
import pinyin4js from 'pinyin4js';
import { RE, MENUS_TYPE } from '../constant';
import { queryMenusListService, queryTableListService } from '../service';

interface IProps {
  form?: FormInstance;
  label?: string;
  placeholder?: string;

  onClick?: (event) => void;

  onCancel?: () => void;

  okText?: string;
  cancelText?: string;
  defaultValue?: string
}
/**  数据表名称 和  数据表编码 模块 */
export const NameCodeItem: React.FC<IProps> = React.memo((props: IProps): ReactElement => {
  const { form } = props;
  const handleNameChange = (e) => {
    const { value } = e.target;
    if (value) {
      const pinyin = formatNameToCode(value);
      form?.setFieldsValue({
        code: pinyin
      });
      form?.validateFields(["code"]);
    }
  };
  /**
  * 格式化数据
  * 将数据中文转换成小写拼音, 并除去括号, 截取前40 个长度
  * @param name
  * @returns str
  */
  const formatNameToCode = (name): string => {
    const pinyin = pinyin4js.convertToPinyinString(name, "", pinyin4js.WITHOUT_TONE);
    const substr = pinyin.replace(RE.BRACKETS, "").substring(0, 40);
    return substr.toLowerCase();
  };
  return (
    <>
      <Form.Item
        name="name" label="数据表名称"
        rules={[
          { required: true, message: '数据表名称不能为空' },
          { pattern: RE.CENUSB, message: '输入字段可以为中文、英文、数字、下划线、括号' },
          { max: 64, message: '最多只能输入64个字符' },
        ]}
      >
        <Input
          onChange={handleNameChange}
          placeholder='最多可输入64个字符，名称唯一。输入字段可以为中文、英文、数字、下划线、括号'
        />
      </Form.Item>
      <Form.Item
        name="code" label="数据表编码" rules={[
          { required: true, message: '数据表编码不能为空' },
          { pattern: RE.ENUS, message: "40个字符，仅支持英文小写、数字、下划线, 不能以数字和下划线开头" },
        ]}
      >
        <Input placeholder='会自动将中文转为首字母大写英文,可手动修改' />
      </Form.Item>
    </>
  );
});

/**  主表模块 */
export const PrimaryTreeItem: React.FC<IProps> = React.memo((props: IProps): ReactElement => {
  const [tree, setTree] = useState<any[]>([]);
  const { label = "主表", placeholder = "请选择主表" } = props;
  useEffect(() => {
    getPrimaryTable();
  }, []);
  const handleSearch = (value: string) => {
    getPrimaryTable(value);
  };
  /**
  * 获取归属模块对应的数据 并将数据转换成tree 结构
  * 表类型为 TABLE(普通表) TREE(树形表) 对应的数据
  */
  const getPrimaryTable = async (name = "") => {
    const res = await queryTableListService({
      name,
      // type: `${TABLE_TYPE.TABLE},${TABLE_TYPE.TREE}`,
    });
    const data = construct(res.result?.data || [], {
      pid: "moduleId",
      id: "id",
      mapping: {
        title: "name",
        value: "code"
      }
    });
    setTree(data);
  };
  /**
    * 每次下拉重新请求数据
    * @param open
    */
  const handleDropdown = (open: boolean) => {
    open && getPrimaryTable();
  };
  return (
    <Form.Item name="mainTableCode" label={label} >
      <TreeSelect
        showSearch
        style={{ width: '100%' }}
        // dropdownStyle={{ maxHeight: 400, overflow: 'auto' }}
        placeholder={placeholder}
        allowClear
        treeIcon={true}
        virtual={true}
        treeData={tree}
        filterTreeNode={false}
        onSearch={handleSearch}
        onDropdownVisibleChange={handleDropdown}
      />
    </Form.Item>
  );
});

/**  归属模块 */
export const ModuleTreeItem: React.FC<IProps> = React.memo((props: IProps): ReactElement => {
  const [moduleTree, setModuleTree] = useState<any[]>([]);
  const { label = "归属模块", placeholder = "请选择归属模块", defaultValue } = props;
  useEffect(() => {
    getMenusData();
  }, []);
  const handleSearch = (value: string) => {
    getMenusData(value);
  };

  const getMenusData = async (name = "") => {
    const res = await queryMenusListService({
      name,
      type: MENUS_TYPE.MODULE,
    });
    const tree = construct(res?.result || [], {
      pid: "pid",
      id: "id",
      mapping: {
        title: "name",
        value: "id"
      }
    });
    setModuleTree(tree);
  };
  /**
   * 每次下拉重新请求数据
   * @param open
   */
  const handleDropdown = (open: boolean) => {
    open && getMenusData();
  };
  return (
    <Form.Item
      name="moduleId"
      label={label}
      rules={[{
        required: true,
        message: "请填写归属模块"
      }]}
    >
      <TreeSelect
        defaultValue = {defaultValue}
        showSearch
        style={{ width: '100%' }}
        placeholder={placeholder}
        allowClear
        treeIcon={true}
        filterTreeNode={false}
        treeData={moduleTree}
        onSearch={handleSearch}
        virtual={true}
        onDropdownVisibleChange={handleDropdown}
      />
    </Form.Item>
  );
});

/** 确认 取消按键 */
export const FromFooterBtn: React.FC<IProps> = React.memo((props: IProps): ReactElement => {
  const { onCancel, okText = "开始创建", cancelText = "取消" } = props;
  return (
    <Row>
      <Col span={24} style={{ textAlign: 'right' }}>
        <Button
          type="primary"
          htmlType="submit"
          className="submit-btn"
        >
          {okText}
        </Button>
        <Button htmlType="button" onClick={onCancel}>
          {cancelText}
        </Button>
      </Col>
    </Row>
  );
});
