import React, { useEffect, useState } from 'react';
import * as AllIconsAI from "react-icons/ai";
import * as AllIconsBI from "react-icons/bi";
import * as AllIconsBS from "react-icons/bs";
import * as AllIconsCG from "react-icons/cg";
import * as AllIconsDI from "react-icons/di";
import * as AllIconsFA from "react-icons/fa";
import * as AllIconsFC from "react-icons/fc";
import * as AllIconsFI from "react-icons/fi";
import * as AllIconsGI from "react-icons/gi";
import * as AllIconsGO from "react-icons/go";
import * as AllIconsGR from "react-icons/gr";
import * as AllIconsHI from "react-icons/hi";
import * as AllIconsIM from "react-icons/im";
import * as AllIconsIO from "react-icons/io";
import * as AllIconsMD from "react-icons/md";
import * as AllIconsRI from "react-icons/ri";
import * as AllIconsWI from "react-icons/wi";
import * as allIcons from "react-icons/all";
import { Tabs } from 'antd';
import { ModalFooter } from '@provider-app/table-editor/components/ChooseDict';

const allIconsByArea = {
  AllIconsAI,
  AllIconsBI,
  AllIconsBS,
  AllIconsCG,
  AllIconsDI,
  AllIconsFA,
  AllIconsFC,
  AllIconsFI,
  AllIconsGI,
  AllIconsGO,
  AllIconsGR,
  AllIconsHI,
  AllIconsIM,
  AllIconsIO,
  AllIconsMD,
  AllIconsRI,
  AllIconsWI
};
const { TabPane } = Tabs;

const IconAppointed: React.FC<IIconAppointed> = (props: IIconAppointed) => {
  const { iconType } = props;
  const Icon = allIcons[iconType];
  return (
    Icon ? (<Icon/>) : null
  );
};
const getIconList = (listAreaKey) => {
  const IconItems:any = [];
  const listArea = allIconsByArea[listAreaKey];
  Object.keys(listArea).map((key) => {
    IconItems.push({ type: key, icon: listArea[key] });
  });
  return IconItems;
};
const SelectIcon: React.FC<ISelectPage> = (props: ISelectPage) => {
  const {
    currentIcon, onOk, onCancel
  } = props;
  const [typeInState, setIconInState] = useState<string>('');
  useEffect(() => {
    return () => {
      setIconInState(currentIcon);
    };
  }, [currentIcon]);
  const list = [
    { key: 'AllIconsAI', tabName: '电脑图标' },
    { key: 'AllIconsBI', tabName: '电脑图标' },
    { key: 'AllIconsBS', tabName: '电脑图标' },
    { key: 'AllIconsCG', tabName: '电脑图标' },
    { key: 'AllIconsDI', tabName: '电脑图标' },
    { key: 'AllIconsFA', tabName: '电脑图标' },
    { key: 'AllIconsFC', tabName: '电脑图标' },
    { key: 'AllIconsFI', tabName: '电脑图标' },
    { key: 'AllIconsGI', tabName: '电脑图标' },
    { key: 'AllIconsGO', tabName: '电脑图标' },
    { key: 'AllIconsGR', tabName: '电脑图标' },
    { key: 'AllIconsHI', tabName: '电脑图标' },
    { key: 'AllIconsIM', tabName: '电脑图标' },
    { key: 'AllIconsIO', tabName: '电脑图标' },
    { key: 'AllIconsMD', tabName: '电脑图标' },
    { key: 'AllIconsRI', tabName: '电脑图标' },
    { key: 'AllIconsWI', tabName: '电脑图标' }
  ];
  const handleOk = () => {
    onOk && onOk(page);
  };
  const handleCancel = () => {
    onCancel && onCancel();
  };
  const getClassName = (typeLoop) => {
    if (iconInState === typeLoop) {
      return "float-left text-xl p-2 m-1 text-blue-500";
    }
    return "float-left text-xl p-2 m-1";
  };
  const handleClick = () => {

  };
  return (
    <>
      <Tabs defaultActiveKey="1" style={{ marginTop: -15 }}>
        {
          list.map((item, index) => {
            return (
              <TabPane tab={item.tabName + index} key={item.key} className="overflow-auto mb-2" style={{ height: 300 }}>
                {
                  getIconList(item.key).map(({ type, icon: IconItem }) => {
                    return (
                      <div
                        className={getClassName(type)}
                        key = {type}
                        onClick={() => {
                          setIconInState(type);
                        }}
                      >
                        <IconItem/>
                      </div>
                    );
                  })
                }
              </TabPane>
            );
          })
        }
      </Tabs>
      <ModalFooter
        onCancel={handleCancel}
        onOk={handleOk}
      />
    </>
  );
};

export { SelectIcon, IconAppointed };
