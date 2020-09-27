import React, { useEffect, useState } from 'react';
import { TreeSelect } from 'antd';
import { MENUS_TYPE } from '../constant';
import { queryMenusListService } from '../api';
import { contructTree } from '../service';

interface IProps {
  initialValue: string
}
/** 归属模块树形下拉组件 */
export const ModuleTreeItem: React.FC<IProps> = React.memo((props: IProps) => {
  const [moduleTree, setModuleTree] = useState([]);
  useEffect(() => {
    /** 初始化渲染下拉树，以回填中文名 */
    getMenusData();
  }, []);
  /**
   * 点击右侧搜索
   * @param value 用户输入的用于模糊搜索的数据
   */
  const handleSearch = (value: string) => {
    getMenusData(value);
  };
  /**
   * 获取模块树形数据
   * @param name 模糊搜索时的名称
   * */
  const getMenusData = async (name = "") => {
    const res = await queryMenusListService({
      name,
      type: MENUS_TYPE?.MODULE,
    });
    /** 进行数据转换，转为树形组件支持的数据格式 */
    const tree = contructTree(res?.result || [], {
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
  const { initialValue } = props;
  return <TreeSelect
    showSearch
    style={{ width: '100%' }}
    allowClear
    defaultValue = { initialValue }
    treeIcon={true}
    filterTreeNode={false}
    treeData={moduleTree}
    onSearch={handleSearch}
    virtual={true}
    onDropdownVisibleChange={handleDropdown}
  />;
});
