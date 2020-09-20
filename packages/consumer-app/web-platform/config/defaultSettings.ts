import { Settings } from '@ant-design/pro-layout';

type DefaultSettings = Settings & {

};

const proSettings: DefaultSettings = {
  navTheme: 'light',
  // 拂晓蓝
  primaryColor: '#1890ff',
  layout: 'mix',
  contentWidth: 'Fluid',
  fixedHeader: false,
  fixSiderbar: true,
  colorWeak: false,
  menu: {
    locale: true,
  },
  title: '',
  iconfontUrl: '',
};

export type { DefaultSettings };

export default proSettings;
