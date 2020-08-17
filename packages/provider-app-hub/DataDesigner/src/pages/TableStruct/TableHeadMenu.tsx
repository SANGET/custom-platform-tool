/** jsx文件必须包含react作用域 */
import React from 'react';
/** 教程 https://www.npmjs.com/package/emotion */
import { css, cx } from 'emotion';

/** react路由暴露出来的页面跳转方法 */
import { useHistory } from 'react-router-dom';

import {
  Menu, Dropdown, Button
} from 'antd';

/** icon图标--向下的箭头 */
import { DownOutlined } from '@ant-design/icons';

/** 当前功能页样式 */
import './TableStruct.less';

const cls1 = css`
  & > .button{
    margin-right:16px;
  }
`;

const TableHeadMenu = (props) => {
  const { openModal } = props;
  /** react路由跳转方法,必须定义在react 组件中,跳转到编辑表页面时要用 */
  const History = useHistory();
  /**
     * 创建权限项下拉按钮菜单点击触发回调
     * 执行模态框内容切换
     * @param e 点击选项事件源
     */
  const dropdownClick = (e) => {
    const { key } = e;
    const keyAction = {
      tpl: () => {

      },
      import: () => {

      },
      export: () => { },
      dict: () => {
        History.push('/DictManage');
      }
    };
    keyAction[key] && keyAction[key]();
  };

  /** 更多按钮菜单 */
  const moreButs = [
    { key: 'tpl', menu: '表结构模板' },
    { key: 'import', menu: '导入表结构' },
    { key: 'export', menu: '导出表结构' },
    { key: 'dict', menu: '字典管理' },
  ];
    /** 更多按钮下拉框选项 */
  const menuList = (
    <Menu onClick={dropdownClick}>
      { moreButs.map((item) => (<Menu.Item key={item.key}>{item.menu}</Menu.Item>))}
    </Menu>
  );
  return (
    <section className="table-head-menu" style={{ margin: "0 20px", width: "calc(100% - 40px)" }}>
      <div className="ant-table-title">数据表列表</div>
      <div className={cx(cls1)} >
        <Button type="primary" className="button" onClick={() => openModal()}>
            新建表
        </Button>
        <Button type="primary" className="button">
            标签管理
        </Button>
        <Dropdown overlay={menuList} placement="bottomRight" trigger={['click']}>
          <Button type="primary" className="button">
              更多按钮 <DownOutlined />
          </Button>
        </Dropdown>
      </div>
    </section>
  );
};

export default TableHeadMenu;
