import { Transfer, Tree, ConfigProvider } from 'antd';
import React from 'react';
import zhCN from 'antd/es/locale/zh_CN'; /** 中文菜单 */
import './treeTransfer.less';

/**
 * 基础树组件
 * @param dataSource 树源数据
 */
const BasicTreeTransfer = ({
  dataSource,
  selectedTree,
  targetKeys,
  ...restProps
}) => {
  /** 是否勾选 */
  const isChecked = (selectedKeys, eventKey) => {
    return selectedKeys.indexOf(eventKey) !== -1;
  };

  return (
    <ConfigProvider locale={zhCN}>
      <Transfer
        {...restProps}
        titles={['页面来源', '生成权限项']}
        locale={{ itemsUnit: '项', itemUnit: '项' }}
        targetKeys={targetKeys}
        dataSource={dataSource}
        className="tree-transfer"
        render={(item) => item.title}
        oneWay
        showSelectAll={false}
      >
        {({
          direction, onItemSelect, selectedKeys, filteredItems
        }) => {
          const checkedKeys = [...selectedKeys, ...targetKeys];
          // console.log('filteredItems=', filteredItems, selectedKeys);
          if (direction === 'left') {
            return (
              <Tree
                checkable
                draggable
                defaultExpandAll
                checkedKeys={checkedKeys}
                selectedKeys={selectedKeys}
                treeData={dataSource}
                onCheck={(_, { node: { key } }) => {
                  // 点击了树节点前面的复选框触发的事件
                  console.log('onCheck', key, checkedKeys);
                  onItemSelect(key, !isChecked(checkedKeys, key));
                }}
              />
            );
          }
          // autoExpandParent 和 expandedKeys 必须同时设置
          return (
            <Tree
              autoExpandParent={true}
              expandedKeys={checkedKeys}
              defaultExpandAll
              treeData={selectedTree}
            />
          );
        }}
      </Transfer>
    </ConfigProvider>
  );
};
export default BasicTreeTransfer;
