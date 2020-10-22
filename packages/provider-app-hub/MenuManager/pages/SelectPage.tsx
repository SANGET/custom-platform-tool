import React, {
  useEffect, useState
} from 'react';
import { Tree, Input, List } from 'antd';
import { ModalFooter } from '@provider-app/table-editor/components/ChooseDict';
import { CompressOutlined, DragOutlined } from '@ant-design/icons';
import { getMenuListServices, getPageListServices } from '../services/apis';
import { MENU_TYPE, SELECT_ALL } from '../constants';

const { Search } = Input;

interface IMeunsTree {
  onSelect?: (selectedKeys) => void;
}

interface INode {
  title: string | React.ReactElement;
  name: string;
  key: string;
  id: string;
  pid: string;
}

const MenuTree: React.FC<IMeunsTree> = (props: IMeunsTree) => {
  const { onSelect } = props;
  const [defExpandedKeys, setDefExpandedKeys] = useState<string[]>([]);
  const [expandedKeys, setExpandedKeys] = useState<string[]>([]);
  const [menusData, setMenusData] = useState<any[]>([]);
  useEffect(() => {
    getMenusListData('');
  }, []);
  const constructTree = (data) => {
    const idMap = {};
    const expandedKeysInMenu = [];
    const jsonTree: INode[] = [];
    data.forEach((node) => { node && (idMap[node.id] = node); });
    data.forEach((node: INode) => {
      if (node) {
        node.key = node.id;
        node.title = node.name;
        const parent = idMap[node.pid];
        if (parent) {
          !parent.children && (parent.children = []);
          parent.children.push(node);
          !expandedKeysInMenu.includes(node.pid) && expandedKeysInMenu.push(node.pid);
        } else {
          jsonTree.push(node);
        }
      }
    });
    return {
      menuList: jsonTree,
      expandedKeysInMenu
    };
  };
  const getMenusListData = async (searchValue) => {
    const res = await getMenuListServices({
      type: MENU_TYPE.MODULE,
      name: searchValue
    });
    const { menuList: tree, expandedKeysInMenu } = constructTree(res?.result || []);
    setMenusData(tree);
    setDefExpandedKeys(expandedKeysInMenu);
  };
  const handleSelect = (selectedKeys, {
    selected
  }) => {
    onSelect && onSelect(selected ? selectedKeys[0] : SELECT_ALL);
  };
  const handleSearch = (value) => {
    getMenusListData(value);
  };
  const onExpand = () => {
    console.log(expandedKeys);
    setExpandedKeys(expandedKeys.length > 0 ? [] : defExpandedKeys);
  };
  // return React.useMemo(() => {
  return (
    <>
      <Search
        className="mb-3"
        onSearch={handleSearch}
      />
      <div
        className="border-solid border-gray-400 w-full p-2"
        style={{ borderWidth: '1px' }}
      >
        <div style={{ height: 20 }}>
          {
            expandedKeys.length > 0
              ? <CompressOutlined
                className = "float-right"
                onClick={onExpand}
              /> : <DragOutlined
                className = "float-right"
                onClick={onExpand}
              />
          }
        </div>
        <Tree
          expandedKeys = {expandedKeys}
          height={283}
          treeData={menusData}
          onSelect={handleSelect}
          onExpand = {(expandedKeysTmpl) => {
            setExpandedKeys(expandedKeysTmpl);
          }}
        />
      </div>
    </>
  );
  // }, [expandTree]);
};

const PageList: React.FC<IPageSelect> = React.memo((props: IPageSelect) => {
  const { moduleId, pageLink, onSelect } = props;
  const [pageList, setPageList] = useState([]);
  console.log(moduleId);
  useEffect(() => {
    getPageListData('');
  }, [moduleId]);
  const getPageListData = async (searchValue) => {
    const res = await getPageListServices({
      name: searchValue,
      belongToMenuId: moduleId
    });
    const pageListTmpl = res?.result?.data?.map((item) => {
      return { pageName: item.name, pageLink: item.id };
    });
    setPageList(pageListTmpl);
  };
  const handleSearch = (value) => {
    getPageListData(value);
  };
  return (<>
    <Search
      className="mb-3"
      onSearch={handleSearch}
    />
    <List
      className="overflow-auto"
      style={{ height: 300 }}
      size="small"
      bordered
      dataSource={pageList}
      renderItem={(item) => (
        item ? (
          <List.Item
            className={`cursor-pointer ${item.pageLink === pageLink ? 'bg-blue-500 text-white' : ''}`}
            onClick={() => {
              onSelect(item);
            }}
          >
            {item.pageName}
          </List.Item>
        ) : null
      )}
    />
  </>);
});
const SelectPage: React.FC<ISelectPage> = (props: ISelectPage) => {
  const {
    currentPage, onCancel, onOk
  } = props;
  const [moduleId, setModuleId] = useState<string>('');
  const [page, setPage] = useState({ pageLink: '', pageName: '' });
  useEffect(() => {
    setPage(currentPage);
  }, [currentPage.pageLink, currentPage.pageName]);
  const handleSelectModule = (module) => {
    const moduleIdTmpl = module === SELECT_ALL ? '' : module;
    setModuleId(moduleIdTmpl);
  };
  const handleSelectPage = (pageCurrent) => {
    if (page.pageLink !== pageCurrent.pageLink) {
      setPage(pageCurrent);
      return;
    }
    setPage({ pageLink: '', pageName: '' });
  };

  const handleOk = () => {
    console.log(page);
    onOk(page);
  };
  const handleCancel = () => {
    onCancel && onCancel();
  };
  return React.useMemo(() => {
    return (
      <div className="select-page-modal">
        <div className="float-left w-2/5" style={{ height: 350 }}>
          <MenuTree
            onSelect={handleSelectModule}
          />
        </div>
        <div className="float-left w-3/5 pl-3" style={{ height: 350 }}>
          <PageList
            moduleId = {moduleId}
            pageLink={page.pageLink}
            onSelect = {handleSelectPage}
          />
        </div>
        <ModalFooter
          onCancel={handleCancel}
          onOk={handleOk}
        />
      </div>
    );
  }, [moduleId, page.pageLink]);
};
export default SelectPage;
