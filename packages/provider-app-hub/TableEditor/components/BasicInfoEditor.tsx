import React from 'react';
import {
  Form, Input, Select, TreeSelect, InputNumber
} from 'antd';
import { FormInstance } from 'antd/lib/form';
import { construct as contructTree } from '@infra/utils/tools';
import { TABLE_TYPE_OPTIONS, TABLE_TYPE, MENUS_TYPE } from '../constants';
import { getMenuListService } from '../apiAgents';

/** 归属模块 */
interface IModuleTreeItem {
  initialValue: string
}
class ModuleTreeItem extends React.Component<IModuleTreeItem> {
  state = {
    moduleList: [],
    searchValue: ''
  }

  /**
   * 获取模块树形数据
   * @param name 模糊搜索时的名称
   * */
  getMenusData = async (name = "") => {
    const menusList = await getMenuListService({
      name,
      type: MENUS_TYPE.MODULE,
    });
    /** 进行数据转换，转为树形组件支持的数据格式 */
    const tree = contructTree(menusList, {
      pid: "pid",
      id: "id",
      mapping: {
        title: "name",
        value: "id"
      }
    });
    return (tree);
  }

  componentWillMount() {
    this.getMenusData().then((moduleList) => {
      this.setState({ moduleList });
    });
  }

  /**
   * 每次下拉重新请求数据
   * @param open
   */
  handleDropdown = (open: boolean) => {
    open && this.getMenusData(this.state.searchValue);
  }

  /**
   * 点击右侧搜索
   * @param value 用户输入的用于模糊搜索的数据
   */
  handleSearch = (searchValue: string) => {
    this.setState({ searchValue });
    this.getMenusData(searchValue);
  }

  render() {
    const { initialValue } = this.props;
    const { moduleList } = this.state;
    return <TreeSelect
      showSearch
      style={{ width: '100%' }}
      allowClear
      defaultValue = { initialValue }
      treeIcon={true}
      filterTreeNode={false}
      treeData={moduleList}
      onSearch={this.handleSearch}
      virtual={true}
      onDropdownVisibleChange={this.handleDropdown}
    />;
  }
}

/** 表基础信息 */
interface BasicInfoEditorProps {
  formRef: React.RefObject<FormInstance<any>>
  basicInfo: any
  className: string
}

class BasicInfoEditor extends React.Component<BasicInfoEditorProps> {
  getClassName() {
    const { basicInfo } = this.props;
    const className = "float-left";
    if (basicInfo.tableType === TABLE_TYPE.TABLE) return `${className} w-1/4`;
    return `${className} w-1/3`;
  }

  render() {
    const { formRef, basicInfo, className } = this.props;
    const layout = {
      labelCol: { span: 8 },
      wrapperCol: { span: 16 },
    };
    return (
      <Form {...layout} ref={formRef} className={className}>
        <Form.Item
          className = {this.getClassName()}
          name="tableName"
          label="数据表名称"
          rules={[
            { required: true, message: '数据表名称不能为空' },
            { pattern: /^[\u4e00-\u9fa5a-zA-Z()][\u4e00-\u9fa5_a-zA-Z0-9()]{0,63}$/, message: '限制64位字符，输入字段包括中文、英文大小写、数字、下划线、英文小括号(_)，不能以数字或下划线_开头' },
          ]}
        >
          <Input/>
        </Form.Item>
        <Form.Item
          className = {this.getClassName()}
          name="tableCode"
          label="数据表编码"
        >
          <Input disabled/>
        </Form.Item>
        <Form.Item
          className = {this.getClassName()}
          name="tableType"
          label="表类型"
        >
          <Select
            disabled options={TABLE_TYPE_OPTIONS}
          />
        </Form.Item>
        {
          basicInfo.relatedModuleId ? (
            <Form.Item
              className = {this.getClassName()}
              name="moduleId"
              label="归属模块"
            >
              <ModuleTreeItem initialValue={basicInfo.relatedModuleId}/>
            </Form.Item>
          ) : null
        }
        {
          basicInfo.tableType === TABLE_TYPE.AUX_TABLE ? (
            <Form.Item
              className = {this.getClassName()}
              name="mainTableName"
              label="主表名称"
            >
              <Input disabled />
            </Form.Item>
          ) : null
        }

        {
          basicInfo.tableType === TABLE_TYPE.TREE ? (
            <Form.Item
              className = {this.getClassName()}
              name="maxLevel"
              label="最大层级"
              rules={[{
                pattern: /^[2-9]|1[0-5]$/, message: '可输入2-15'
              }]}
            >
              <InputNumber />
            </Form.Item>
          ) : null
        }
      </Form>
    );
  }
}
export default BasicInfoEditor;
