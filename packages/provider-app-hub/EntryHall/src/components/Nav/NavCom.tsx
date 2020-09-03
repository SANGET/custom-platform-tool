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
  treeData: DataItem[]
  mode?
}

const Tree: React.FC<TreeProps> = (props) => {
  const {
    level, treeData, mode = 'horizontal'
  } = props;

  return (
    <Menu mode={mode}>
      {
        treeData.map((item) => {
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
                parentNode={item}
                mode='vertical'
                level={level + 1}
              />
            </SubMenu>
          ) : (
            <Menu.Item
              key={id}
              onClick={(e) => {
                onNavigate({
                  type: 'PUSH',
                  route: path,
                  params: { title }
                });
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

export const Nav = ({
  navConfig
}) => {
  return (
    <div className="app-nav">
      <Tree
        treeData={navConfig}
        level={0}
      />
    </div>
  );
};
