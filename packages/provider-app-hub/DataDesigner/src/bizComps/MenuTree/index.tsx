import React, { useState } from 'react';
import { Tree, Input } from 'antd';
/** 导出树形数据搜索需要用到的方法 */
import { treeToList, findMatch } from '@provider-app/data-designer/src/tools/tree';

const MenuTree = ({ dataSource, ...props }) => {
  const { getClickNodeValue } = props;
  /** 扁平结构的树形数组数组 */
  const treeList = treeToList(dataSource, []);
  // console.log({ dataSource });
  /** 设置要展开的节点 */
  const [expandedKeys, setExpandedKeys] = useState([]);
  /** 自动展开父节点 */
  const [autoExpandParent, setAutoExpandParent] = useState(true);
  /** 设置搜索值-树过滤要用 */
  const [searchValue, setSearchValue] = useState('');

  /**
   * 高亮与搜索值相匹配的树节点
   * @param searchValue 搜素值
   * @param treeNodes数据
   * 这个方法不能分离到tree.ts中去,因为里面包含了tsx语法
   */
  const hightLight = ({ searchValue, treeNode }) => treeNode.map((item) => {
    const index = item.title.indexOf(searchValue);

    const title = index > -1 ? (
      <span>
        {/* 以搜索值为分界点, 将title划分为三部分   */}
        {/* title=item.title.substr(0, index)+搜索值+item.title.substr(index + searchValue.length) */}
        {item.title.substr(0, index)}
        <span style={{ color: "red" }}>{searchValue}</span>
        {item.title.substr(index + searchValue.length)}
      </span>
    ) : (<span>{item.title}</span>);

    // 如果有子节点，继续循环
    if (item.children) {
      return { title, key: item.key, children: hightLight({ searchValue, treeNode: item.children }) };
    }

    return {
      title,
      key: item.key
    };
  });

  /** 如果组件属性对应的方法很长，或者需要复用,应该在组件属性对象外面定义,比如像heightLight */
  /** 如果属性对应的回调比较简短且不需复用,定义在组件属性对象里面可读性更好,比如像onExpand */
  /** 展开收起属性改变时,会触发树组件重新渲染 */
  /**  */
  /** Tree组件属性设置 */
  const tProps = {
    ...props,
    expandedKeys,
    autoExpandParent,
    treeData: dataSource.length > 0 && hightLight({ searchValue, treeNode: dataSource }),
    // onDrop,
    /**
   * 展开/收起节点时触发
   * @param expandedKeys 展开节点的key集合
   */
    onExpand: (expandedKeys) => {
    /** 收起其它父节点 */
      setAutoExpandParent(false);
      /** 只展开匹配的子节点 */
      setExpandedKeys(expandedKeys);
    },
    onSelect: (selectedKeys, e:{selected, selectedNodes, node, event}) => {
      console.log(selectedKeys, e);
      const node = treeList.find((item) => item.key === selectedKeys[0]);
      // console.log(treeList, treeList.find((item) => item.key === selectedKeys[0]));
      setSearchValue(node.title);
      getClickNodeValue && getClickNodeValue(node);
    }
  };
  /** 搜素组件属性设置 */
  const searchProps = {
    placeholder: '输入模块名称',
    style: { margin: '16px 8px', width: 'calc(100% - 16px)' },
    value: searchValue,
    /**
   * 树过滤搜索框改变触发回调,展开匹配树节点
   * @param e input事件源
   * @param treeData 嵌套树 外部定义-非直接传入
   * @param treeList 扁平树 外部定义-非直接传入
   */
    onChange: (e) => {
      const { value: searchValue } = e.target;
      // console.log(expandedKeys);
      /** 展开与搜素文字匹配的节点 */
      setExpandedKeys(findMatch({ treeList, treeData: dataSource, searchValue }));
      /** 设置搜索值，外部方法传参要用 */
      setSearchValue(searchValue);
      /** 展开父节点 */
      setAutoExpandParent(true);
    },

  };

  return (
    <div>
      <Input {...searchProps} />
      <Tree {...tProps} />
    </div>
  );
};

export default MenuTree;
