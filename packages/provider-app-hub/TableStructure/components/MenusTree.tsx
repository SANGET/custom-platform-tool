import React, {
  useEffect, useState, forwardRef, useImperativeHandle
} from 'react';
import { Tree, Input } from 'antd';
import { queryMenusListService } from '../service';
import './index.less';
import { MENUS_TYPE, SELECT_ALL } from '../constant';

const { Search } = Input;

interface IProps {
  onSelect?: (selectedKeys) => void;
  ref?: React.Ref<any>;
}

interface INode {
  title: string | React.ReactElement;
  name: string;
  key: string;
  id: string;
  pid: string;
}

const MeunsTree: React.FC<IProps> = forwardRef((props: IProps, ref) => {
  const { onSelect } = props;
  let searchValue = "";
  const [menusData, setMenusData] = useState<any[]>([]);
  useImperativeHandle(ref, () => ({
    reload: () => getMenusListData()
  }));
  useEffect(() => {
    getMenusListData();
  }, []);
  const constructTree = (data) => {
    const idMap = {};
    const jsonTree: INode[] = [];
    data.forEach((node) => { node && (idMap[node.id] = node); });
    data.forEach((node: INode) => {
      if (node) {
        // eslint-disable-next-line no-param-reassign
        node.title = renderHighlightValue(node.name);
        // eslint-disable-next-line no-param-reassign
        node.key = node.id;
        const parent = idMap[node.pid];
        if (parent) {
          !parent.children && (parent.children = []);
          parent.children.push(node);
        } else {
          jsonTree.push(node);
        }
      }
    });
    return jsonTree;
  };

  const renderHighlightValue = (name): React.ReactElement => {
    const index = name.indexOf(searchValue);
    const beforeStr = name.substr(0, index);
    const afterStr = name.substr(index + searchValue.length);
    const title = index > -1
      ? (
        <span>
          {beforeStr}
          <span className="tree-search-value">{searchValue}</span>
          {afterStr}
        </span>
      ) : (
        <span>{name}</span>
      );
    return title;
  };
  const getMenusListData = async () => {
    const res = await queryMenusListService({
      type: MENUS_TYPE.MODULE,
      name: searchValue
    });
    const tree = constructTree(res?.result || []);
    setMenusData(tree);
  };
  const handleSelect = (selectedKeys, {
    selected
  }) => {
    onSelect && onSelect(selected ? selectedKeys[0] : SELECT_ALL);
  };
  const handleSearch = (value) => {
    searchValue = value;
    getMenusListData();
  };
  return (
    <div>
      <Search
        style={{ marginBottom: 8 }}
        onSearch={handleSearch}
      />
      <Tree
        treeData={menusData}
        onSelect={handleSelect}
      />
    </div>
  );
});
export default React.memo(MeunsTree);
