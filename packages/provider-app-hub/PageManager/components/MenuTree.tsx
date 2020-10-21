import React, {
  forwardRef
} from 'react';
import { Tree, Input } from 'antd';
import useMenuList from '../useMenuList';
import { SELECT_ALL } from '../constant';
import './index.less';

const { Search } = Input;

interface IProps {
  onSelect?: (selectedKeys: React.ReactText) => void;
}

const MenuTree = forwardRef((props: IProps, ref: React.Ref<{reload: () => void}>) => {
  const { onSelect } = props;
  const [menusData, getMenuData] = useMenuList();
  return (
    <div>
      <Search
        style={{ marginBottom: 8 }}
        onSearch={(value) => {
          getMenuData(value);
        }}
      />
      <Tree
        treeData={menusData}
        onSelect={(selectedKeys, {
          selected
        }) => {
          onSelect && onSelect(selected ? selectedKeys[0] : SELECT_ALL);
        }}
      />
    </div>
  );
});
export default React.memo(MenuTree);
