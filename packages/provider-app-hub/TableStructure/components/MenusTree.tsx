import React, { useEffect, useState } from 'react';
import { queryMenusListService } from '../service';
import { Tree, Input } from 'antd';
const { Search } = Input;
import './index.less'
import { MENUS_TYPE } from '../constant';
import { construct } from '@infra/utils/tools';
interface IProps {

}

const MeunsTree: React.FC<IProps> = (props: IProps) => {
  const [menusData, setMenusData] = useState<any[]>([])
  // @ts-ignore
  useEffect(() => {
    getMenusListData()
  }, [])
  const getMenusListData = async (name: string = "") => {
    const res = await queryMenusListService({
      type: MENUS_TYPE.MODULE,
      name
    })
    const tree = construct(res?.result || [], {
      pid: "pid",
      id: "id",
      mapping: {
        key: "id",
        title: "name"
      }
    })
    setMenusData(tree)

  }
  return (
    <div>
      <Search style={{ marginBottom: 8 }} placeholder="Search" />
      <Tree
        treeData={menusData}
      />
    </div>
  );
};

export default React.memo(MeunsTree);
