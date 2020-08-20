import React from 'react';
import { Dropdown, Button } from 'antd';

/** icon图标--向下的箭头 */
import { DownOutlined } from '@ant-design/icons';

/**
 * 表格头部菜单
 * @param props-title 表格标题
 * @param props-menus 表头按钮菜单
 */
const TableHeadMenu = (props) => {
  const { title, menus = [], style = {} } = props;
  const getMenus = (menus) => {
    return menus.map((item) => {
      if (item.overlay) {
        return (<Dropdown key={item.text} overlay={item.overlay} placement="bottomRight" trigger={['click']}>
          <Button type="primary" className="button">{item.text}<DownOutlined /></Button>
        </Dropdown>);
      }
      return (<Button key={item.text} type="primary" className="button" onClick={item.onClick}>{item.text}</Button>);
    });
  };
  return (<section className="table-head-menu" style={style}>
    <div className="ant-table-title">{title}</div>

    <div>{getMenus(menus)}</div>

  </section>);
};

export default TableHeadMenu;
