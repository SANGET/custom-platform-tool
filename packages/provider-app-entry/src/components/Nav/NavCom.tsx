import React from 'react';
import { Link, onNavigate } from 'multiple-page-routing';
import { Menu } from 'antd';
import { AppstoreOutlined, MailOutlined, SettingOutlined } from '@ant-design/icons';

const { SubMenu } = Menu;

interface DataItem {
  children?: DataItem[]
  title: string
  path: string
  id: string
  icon: string
}

interface TreeProps {
  level: number
  treeData?: DataItem[]
  mode?
  onItemClick: (item) => void
}

const MenuTree: React.FC<TreeProps> = (props) => {
  const {
    level, treeData, mode = 'horizontal',
    onItemClick
  } = props;

  return (
    <Menu mode={mode}>
      {
        treeData && treeData.map((item) => {
          const {
            title, icon, id, children, path
          } = item;
          const hasChild = Array.isArray(children) && children.length > 0;
          const levelId = id;
          return hasChild ? (
            <SubMenu
              icon={icon}
              title={title}
              key={id}
            >
              <MenuTree
                treeData={children}
                onItemClick={onItemClick}
                mode='vertical'
                level={level + 1}
              />
            </SubMenu>
          ) : (
            <Menu.Item
              key={id}
              onClick={(e) => {
                onItemClick(item);
              }}
            >
              {title}
            </Menu.Item>
          );
        })
      }
    </Menu>
  );
};

export const Nav = (props) => {
  const {
    navConfig
  } = props;
  return (
    <div className="app-nav">
      <Menu mode="horizontal">
        <MenuTree
          treeData={navConfig}
          onItemClick={(item) => {
            const { title, path } = item;
            onNavigate({
              type: 'PUSH',
              path,
              params: {
                title,
              }
            });
          }}
          level={0}
        />
      </Menu>
    </div>
  );
};
