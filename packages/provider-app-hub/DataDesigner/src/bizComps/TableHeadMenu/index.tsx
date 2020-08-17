import React from 'react';
import { Button } from 'antd';
/**
 * 表格头部菜单
 * @param props-title 表格标题
 * @param props-menus 表头按钮菜单
 */
const TableHeadMenu = (props) => {
  const { title, menus = [], style = {} } = props;
  return (<section className="table-head-menu" style={style}>
    <div className="ant-table-title">{title}</div>
    <div >
      {menus.map((item) => (<Button key={item.text} type="primary" className="button" onClick={item.onClick}>{item.text}</Button>))}
    </div>
  </section>);
};

export default TableHeadMenu;
