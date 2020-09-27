import React, { ReactElement, useState } from 'react';
import { Switch } from 'antd';
import {
  AlignRightOutlined, StarOutlined, MenuFoldOutlined, MenuUnfoldOutlined
} from '@ant-design/icons';
import MenuSearch from '../MenuSearch';
import "./index.less";

interface IMenuExtraProps {
  collapsed: boolean;
  onCollapseChange: (value: boolean) => void;
}
const MenuExtra: React.FC<IMenuExtraProps> = (props): ReactElement => {
  const { collapsed, onCollapseChange } = props;
  const [visible, setVisible] = useState<boolean>(false);
  const handleSelect = (value) => {
    setVisible(value);
  };
  return (
    <div className="meun-extra">
      {
        !visible && !collapsed && <Switch
          checkedChildren={<AlignRightOutlined />}
          unCheckedChildren={<StarOutlined />}
          defaultChecked
        />
      }
      <div className="right">
        {
          !collapsed && <MenuSearch
            onSelect={handleSelect}
          />
        }
        {
          collapsed ? <MenuUnfoldOutlined
            className="icon-menu"
            onClick={() => onCollapseChange && onCollapseChange(false)}
          />
            : <MenuFoldOutlined
              className="icon-menu left"
              onClick={() => onCollapseChange && onCollapseChange(true)}
            />
        }

      </div>
    </div>
  );
};

export default React.memo(MenuExtra);
