import React from 'react';
import { Link } from 'multiple-page-routing';
import { Menu } from 'antd';
import { AppstoreOutlined, MailOutlined, SettingOutlined } from '@ant-design/icons';

const { SubMenu } = Menu;

export const Nav = ({
  navConfig
}) => {
  const handleClick = () => {

  };
  return (
    <div className="app-nav">
      {/* <span>LOGO</span> */}
      <Menu onClick={handleClick} mode="horizontal">
        <Link to="/page-manager" className="" params={{ title: '页面管理' }}>页面管理</Link>
        <SubMenu key="sub1" icon={<MailOutlined />} title="页面设计">
          <Menu.Item key="111">
            <Link to="/page-manager" params={{ title: '页面管理' }}>页面管理</Link>
          </Menu.Item>
          <Menu.Item key="112">
          弹窗选择
          </Menu.Item>
          <Menu.Item key="113">控件模版</Menu.Item>
        </SubMenu>
        <SubMenu key="sub2" icon={<AppstoreOutlined />} title="数据设计">
          <Menu.Item key="221">
            <Link to="/TableStruct" params={{ title: '表结构管理' }}>表结构管理</Link>
          </Menu.Item>
          <Menu.Item key="222">
          字典管理
          </Menu.Item>
          <SubMenu key="sub3" title="其他数据源">
            <Menu.Item key="223">接口数据</Menu.Item>
            <Menu.Item key="224">静态数据</Menu.Item>
            <Menu.Item key="225">数据仓库</Menu.Item>
          </SubMenu>
          <Menu.Item key="4">
          数据分析
          </Menu.Item>
        </SubMenu>
        <SubMenu key="sub4" icon={<SettingOutlined />} title="流程设计">
          <Menu.Item key="331">Option 9</Menu.Item>
          <Menu.Item key="332">Option 10</Menu.Item>
          <Menu.Item key="333">Option 11</Menu.Item>
          <Menu.Item key="334">Option 12</Menu.Item>
        </SubMenu>
      </Menu>
    </div>
    // <div className="nav-bar layout">
    //   {
    //     navConfig.map((item, idx) => {
    //       // console.log(item);
    //       const { id, text, path } = item;
    //       return (
    //         <div key={id} className="p10">
    //           <Link to={path}>
    //             {text}
    //           </Link>
    //         </div>
    //       );
    //     })
    //   }
    // </div>
  );
};
