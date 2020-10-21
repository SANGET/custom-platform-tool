import React, {
  useEffect, useState
} from 'react';
import { DataNode } from "antd/lib/tree";
import { queryMenusListService } from './services/apis';
import { MENUS_TYPE } from './constant';
import { INode } from './interface';
import './index.less';

type IUseMenuList = () => [DataNode[], (searchValue?: string) => void]

const useMenuList: IUseMenuList = () => {
  const [menuData, setMenuData] = useState<DataNode[]>([]);
  /**
   * 构造树组件所需结构
   * @param data 后端返回树结构
   */
  const constructTree = (data, searchValue?: string) => {
    const idMap = {};
    const jsonTree: INode[] = [];
    data.forEach((node) => { node && (idMap[node.id] = node); });
    data.forEach((node: INode) => {
      if (node) {
        // eslint-disable-next-line no-param-reassign
        node.title = searchValue ? renderHighlightValue(node.name, searchValue) : node.name;
        // eslint-disable-next-line no-param-reassign
        node.key = node.id;
        const parent = idMap[node.pid];
        if (parent) {
          !parent.children && (parent.children = []);
          parent.children.push(node);
        } else {
          jsonTree.push(node);
        }
      }
    });
    return jsonTree;
  };
  /**
   * 渲染高亮（匹配搜索框）
   * @param name 菜单名
   */
  const renderHighlightValue = (name: string, value:string): React.ReactElement => {
    const index = name.indexOf(value);
    const beforeStr = name.substr(0, index);
    const afterStr = name.substr(index + value.length);
    const title = index > -1
      ? (
        <span>
          {beforeStr}
          <span className="tree-search-value">{value}</span>
          {afterStr}
        </span>
      ) : (
        <span>{name}</span>
      );
    return title;
  };
  /**
   * 获取菜单数据
   */
  const getMenuData = (searchValue?: string) => {
    queryMenusListService({
      type: MENUS_TYPE.MODULE,
      name: searchValue
    }).then((res) => {
      const tree = constructTree(res?.result || [], searchValue);
      setMenuData(tree);
    });
  };
  useEffect(() => {
    getMenuData();
  }, []);
  return [menuData, getMenuData];
};

export default useMenuList;
