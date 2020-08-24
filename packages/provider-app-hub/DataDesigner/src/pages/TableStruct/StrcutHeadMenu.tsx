/** jsx文件必须包含react作用域 */
import React, { useEffect } from 'react';
/** 教程 https://www.npmjs.com/package/emotion */

/** react路由暴露出来的页面跳转方法 */
// import { useHistory } from 'react-router-dom';
import { onNavigate } from 'multiple-page-routing';

import { Menu } from 'antd';

/**
* 表头菜单组件
*/
import TableHeadMenu from '@provider-app/data-designer/src/bizComps/TableHeadMenu';
import { ItemTypes } from '@engine/visual-editor/spec/types';

/**
* 结构表表头菜单
* openModal--打开新建表弹窗
*/
const StructHeadMenu = ({ openModal, form, getList }) => {
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
        // History.push('/DictManage');
        onNavigate({
          type: "PUSH",
          route: '/data_designer/dict_manage'
        });
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

  /**
  * 字段列表属性配置
  */
  const tableHeadMenuProps = {
    title: '数据表列表',
    style: { margin: "0 20px", width: "calc(100% - 40px)" },
    menus: [
      {
        text: "新建表",
        onClick: () => {
          getList({});
          form.resetFields();
          openModal();
        }
      },
      {
        text: "标签管理",
        onClick: () => { }
      },
      {
        text: "更多按钮",
        overlay: menuList,
      },

    ]
  };
  return (
    <TableHeadMenu {...tableHeadMenuProps} />
  );
};

export default StructHeadMenu;
