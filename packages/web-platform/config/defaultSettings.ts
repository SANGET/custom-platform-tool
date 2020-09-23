import { Settings } from '@ant-design/pro-layout';

type IDefaultSettings = Settings & {

};

const proSettings: IDefaultSettings = {
  navTheme: 'light',
  // 拂晓蓝
  primaryColor: '#1890ff',
  layout: 'mix',
  contentWidth: 'Fluid',
  fixedHeader: false,
  fixSiderbar: true,
  colorWeak: false,
  menu: {
    locale: false,
  },
  title: '自定义平台基础数据管理服务',
  iconfontUrl: '',
};

export type { IDefaultSettings };

export default proSettings;
