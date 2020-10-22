import React, { useEffect, useState } from 'react';
import * as AllIconsBI from "react-icons/bi";
import * as AllIconsRI from "react-icons/ri";
import { Tabs, notification } from 'antd';
import { ModalFooter } from '@provider-app/table-editor/components/ChooseDict';
import { useIcon } from '@infra/utils/useIcon';
import { MESSAGE } from '../constants';

const { TabPane } = Tabs;
interface IIconAppointed {
  iconType: string
}
/** 展示 iconType 指定的 icon */
const IconAppointed: React.FC<IIconAppointed> = (props: IIconAppointed) => {
  const { iconType } = props;
  const [ready, icons] = useIcon('react-icons/all');
  const Icon = icons[iconType];
  return (
    ready ? (<Icon/>) : null
  );
};
const filterIconByArea = {
  AllIconsBI: () => {
    return AllIconsBI;
  },
  AllIconsRI: () => {
    const ri = {};
    /** UI 要求不要面性图标 */
    for (const key in AllIconsRI) {
      if (!/Fill$/.test(key)) {
        ri[key] = AllIconsRI[key];
      }
    }
    return ri;
  }
};
/** 获取用于展示的 icon 列表 */
const getIconList = (listAreaKey) => {
  const IconItems = [];
  const listArea = filterIconByArea[listAreaKey]();
  Object.keys(listArea).map((key) => {
    IconItems.push({ type: key, icon: listArea[key] });
  });
  return IconItems;
};
/** 选择 icon  */
interface ISelectPage {
  currentIcon: string
  onOk: (param: string) => void
  onCancel: () => void
}
const SelectIcon: React.FC<ISelectPage> = (props: ISelectPage) => {
  const {
    currentIcon, onOk, onCancel
  } = props;
  const [iconSelected, setIconSelected] = useState<string>('');
  useEffect(() => {
    setIconSelected(currentIcon);
  }, [currentIcon]);
  const list = [
    { key: 'AllIconsRI', tabName: '电脑图标' },
    { key: 'AllIconsBI', tabName: '手机图标' }
  ];
  /** 点击保存 */
  const handleOk = () => {
    /** 强制选择图标 */
    if (!iconSelected) {
      notification.warn({
        message: MESSAGE.SELECT_ICON_FAILED,
      });
      return;
    }
    onOk && onOk(iconSelected);
  };
  const handleCancel = () => {
    onCancel && onCancel();
  };
  return (
    <>
      <Tabs defaultActiveKey="1" style={{ marginTop: -15 }}>
        {
          list.map((item, index) => {
            return (
              <TabPane tab={item.tabName} key={item.key} className="overflow-auto mb-2" style={{ height: 300 }}>
                {
                  getIconList(item.key).map(({ type, icon: IconItem }) => {
                    return (
                      <div
                        className={
                          iconSelected === type
                            ? 'float-left text-xl p-2 m-1 bg-blue-500 text-white cursor-pointer'
                            : 'float-left text-xl p-2 m-1 cursor-pointer'
                        }
                        key = {type}
                        onClick={() => {
                          setIconSelected(type);
                        }}
                      >
                        {type}
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
