// import { Tree } from 'antd';
import React, { FC, useState } from 'react';
import { Tree, Input } from 'antd';

const dataList = [];
const generateList = (data) => {
  for (let i = 0; i < data.length; i++) {
    const node = data[i];
    const { key, title } = node;
    dataList.push({ key, title });
    if (node.children) {
      generateList(node.children);
    }
  }
};

/**
 * 根据子节点的key查找父节点的key
 * @param key  子节点的key
 * @param tree  treeNodes数据
 */
const getParentKey = (key, tree) => {
  let parentKey;
  for (let i = 0; i < tree.length; i++) {
    const node = tree[i];
    // 如果存在子节点
    if (node.children) {
      // 在子节点集合中找到要找的节点
      if (node.children.some((item) => item.key === key)) {
        parentKey = node.key;
      } else if (getParentKey(key, node.children)) {
        // 未找到继续遍历
        parentKey = getParentKey(key, node.children);
      }
    }
  }
  return parentKey;
};

const BasicTree = ({ dataSource, ...props }) => {
  generateList(dataSource);
  // console.log({ dataSource });
  // const { searchValue } = props;
  // const [treeData, setTreeData] = useState(dataSource);
  const [expandedKeys, setExpandedKeys] = useState([]);
  const [searchValue, setSearchValue] = useState('');
  const [autoExpandParent, setAutoExpandParent] = useState(true);

  /**
   * 展开/收起节点时触发
   * @param expandedKeys 展开节点的key集合
   */
  const onExpand = (expandedKeys) => {
    setExpandedKeys(expandedKeys);
    setAutoExpandParent(false);
  };
  /**
   * 树过滤搜索框改变触发回调
   * @param e 输入事件源
   */
  const onChange = (e) => {
    const { value } = e.target;
    const loop = (dataList) => dataList
      .map((item) => {
        if (item.title.indexOf(value) > -1) {
          return getParentKey(item.key, dataSource);
        }
        return null;
      })
      .filter((item, i, self) => item && self.indexOf(item) === i);
    // console.log(expandedKeys);
    setExpandedKeys(loop(dataList));

    setSearchValue(value);
    setAutoExpandParent(true);
  };

  /**
   * 拖拽位置处理
   * @param info ={event, node, dragNode, dragNodesKeys}
   * @param node 目标节点
   * @param dragNode 拖拽节点
   * @param dragNodesKeys 拖拽节点的key
   * @param event 拖拽dom事件属性
   * @param dropToGap: 代表连接到节点之间的缝隙中，为true,表示拖拽与目标节点是前后邻居关系，为false表示拖拽与目标节点是子节点关系。
   * @param dropPosition antd 依赖了 rc-tree，在 rc-tree 里 dropPosition 是一个相对地址。
   * 如果拖到了目标节点的上面是 -1，下面则是 1。antd 里则是相对于目标节点的 index。
   * 如果拖动时正好落在该节点上，dropPosition 就是该节点的 index。
   * 如果落在目标节点的上方, dropPosition=目标节点的index-1
   * 如果落在目标节点的下方, dropPosition=目标节点的index+1
   */
  const onDrop = (info) => {
    const {
      event, node, dragNode, dragNodesKeys
    } = info;
    // console.log(info, event, node, dragNode, dragNodesKeys);
    /** 目标节点的key */
    const dropKey = node.key;
    /** 拖拽节点的key */
    const dragKey = dragNode.key;
    /** 目标节点在其父节点下的路径,最后一位是子节点的序号 */
    const dropPos = node.pos.split('-');
    // 计算相对位置
    // dropPosition=-1,拖拽节点被拖拽到目标节点上方
    // dropPosition=0,拖拽节点被拖拽到目标节点上
    // dropPosition=1,拖拽节点被拖拽到目标节点下方
    const dropPosition = info.dropPosition - Number(dropPos[dropPos.length - 1]);
    // console.log(info.dropToGap, info.dropPosition, dropPos, node, dropPosition);

    // 根据节点的key,从data对象中找到对应节点的完整属性
    const loop = (data, key, callback) => {
      for (let i = 0; i < data.length; i++) {
        if (data[i].key === key) {
          return callback(data[i], i, data);
        }
        if (data[i].children) {
          loop(data[i].children, key, callback);
        }
      }
    };
    const data = [...treeData];
    let dragObj; // 存放被拖拽的节点
    loop(data, dragKey, (item, index, arr) => {
      arr.splice(index, 1); // 从data对象中删除被拖拽元素
      dragObj = item;
    });
    // 拖拽节点是目标节点的子节点
    if (!info.dropToGap) {
      // 找到目标节点,把拖拽节点添加到目标节点子节点的尾部
      loop(data, dropKey, (item) => {
        item.children = item.children || [];
        item.children.push(dragObj);
      });
    } // 拖拽与目标节点是前后相邻关系
    else {
      let ar; // 存放剔除了被拖拽节点的树形节点集合
      let i; // 存放放置节点的位置
      loop(data, dropKey, (item, index, arr) => {
        ar = arr;
        i = index;
      });
      // 将拖拽节点移动到目标节点上方
      if (dropPosition === -1) {
        ar.splice(i, 0, dragObj);
      } else {
        // 将拖拽节点移动到目标节点下方
        ar.splice(i + 1, 0, dragObj);
      }
    }

    // console.log(data);
    setTreeData(data);
  };
  /**
   * 与搜索框输入内容相匹配的节点
   * @param searchValue 搜素值
   * @param data treeNodes数据
   */
  const loop = (searchValue, data) => data.map((item) => {
    const index = item.title.indexOf(searchValue);

    const title = index > -1 ? (
      <span>
        {/* 以搜索值为分界点, 将title划分为三部分   */}
        {/* title=item.title.substr(0, index)+搜索值+item.title.substr(index + searchValue.length) */}
        {item.title.substr(0, index)}
        <span className="site-tree-search-value">{searchValue}</span>
        {item.title.substr(index + searchValue.length)}
      </span>
    ) : (<span>{item.title}</span>);

    // 如果有子节点，继续循环
    if (item.children) {
      return { title, key: item.key, children: loop(searchValue, item.children) };
    }

    return {
      title,
      key: item.key
    };
  });

  const tProps = {
    ...props,
    onDrop,
    onExpand,
    expandedKeys,
    autoExpandParent,
    treeData: loop(searchValue, dataSource),
    onSelect: (selectedKeys, e:{selected: bool, selectedNodes, node, event}) => {
      console.log(selectedKeys, e);
    }
  };
  const inputProps = {
    onChange,
    style: { margin: '16px 8px', width: 'calc(100% - 16px)' },
    placeholder: '输入模块名称'
  };
  // treeData={loop(searchValue, treeData)}
  // console.log(treeData);
  return (
    <div>
      <Input {...inputProps} />
      {/* <Tree  treeData={loop(searchValue, dataSource)} /> */}
      <Tree {...tProps} />
    </div>
  );
};

export default BasicTree;
