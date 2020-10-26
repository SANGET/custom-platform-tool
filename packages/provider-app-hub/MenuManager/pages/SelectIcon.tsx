import React, { useEffect, useState } from 'react';
import { Tabs, notification } from 'antd';
import { ModalFooter } from '@provider-app/table-editor/components/ChooseDict';
import { useIcon } from '@infra/utils/useIcon';
import { MESSAGE } from '../constants';

const { TabPane } = Tabs;

const IconAppointed: React.FC<IIconAppointed> = (props: IIconAppointed) => {
  const { iconType } = props;
  const [ready, icons] = useIcon('react-icons/all');
  const Icon = icons[iconType];
  return (
    ready ? (<Icon/>) : null
  );
};
const getAllIconByArea = {
  AllIconsBI: () => {
    return AllIconsBI;
  },
  AllIconsRI: () => {
    const ri = {};
    for (const key in AllIconsRI) {
      if (/Fill$/.test(key)) continue;
      ri[key] = AllIconsRI[key];
    }
    return ri;
  }
};
const getIconList = (listAreaKey) => {
  const IconItems:any = [];
  const listArea = getAllIconByArea[listAreaKey]();
  Object.keys(listArea).map((key) => {
    IconItems.push({ type: key, icon: listArea[key] });
  });
  return IconItems;
};
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
    { key: 'AllIconsBI', tabName: '手机图标' },
    // { key: 'AllIconsAI', tabName: '电脑图标' },
    // { key: 'AllIconsBS', tabName: '电脑图标' },
    // { key: 'AllIconsCG', tabName: '电脑图标' },
    // { key: 'AllIconsDI', tabName: '电脑图标' },
    // { key: 'AllIconsFA', tabName: '电脑图标' },
    // { key: 'AllIconsFC', tabName: '电脑图标' },
    // { key: 'AllIconsFI', tabName: '电脑图标' },
    // { key: 'AllIconsGI', tabName: '电脑图标' },
    // { key: 'AllIconsGO', tabName: '电脑图标' },
    // { key: 'AllIconsGR', tabName: '电脑图标' },
    // { key: 'AllIconsHI', tabName: '电脑图标' },
    // { key: 'AllIconsIM', tabName: '电脑图标' },
    // { key: 'AllIconsIO', tabName: '电脑图标' },
    // { key: 'AllIconsMD', tabName: '电脑图标' },
    // { key: 'AllIconsWI', tabName: '电脑图标' }
  ];
  const handleOk = () => {
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
