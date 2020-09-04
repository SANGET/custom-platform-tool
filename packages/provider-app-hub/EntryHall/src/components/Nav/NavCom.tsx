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
  onItemClick: () => void
}

const Tree: React.FC<TreeProps> = (props) => {
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
              <Tree
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
      <Tree
        treeData={navConfig}
        onItemClick={(item) => {
          const { title, path } = item;
          const {
            location
          } = props;
          onNavigate({
            type: 'PUSH',
            route: path,
            params: {
              title,
            }
          });
        }}
        level={0}
      />
    </div>
  );
};
