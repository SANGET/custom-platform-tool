/* eslint-disable no-param-reassign */
import React, { useState, useReducer, useMemo } from 'react';
import {
  Layout, Menu, Breadcrumb, Table
} from 'antd';
import { UserOutlined, LaptopOutlined, NotificationOutlined } from '@ant-design/icons';
import 'antd/dist/antd.less';
import { AllUI } from './component-manage/UI-factory/types';
import {
  TootipFactory, FromWrapFactory, BaseInputFactory, FormItemFactory
} from './component-manage/UI-factory';
import { RenderComp } from './component-manage/component-store/render-component';
/** 这是旧的 */
// import TableFactory from './component-manage/UI-factory/data-display/table';

const { SubMenu } = Menu;
const { Header, Content, Sider } = Layout;

const RenderComponentList = {
  [AllUI.FormItem]: FormItemFactory,
  [AllUI.Tootip]: TootipFactory,
  [AllUI.BaseInput]: BaseInputFactory
};
export const DefaultCtx = React.createContext({});

const Child: React.FC<any> = (props = {}) => {
  console.log(`--- re-render ---`);
  return (
    <div>
      <p>number is : {props.number}</p>
    </div>
  );
};

const ChildMemo: React.FC<any> = (props = {}) => {
  console.log(`--- component re-render ---`);
  return useMemo(() => {
    console.log(`--- useMemo re-render ---`);
    return <div>
      <p>number is : {props.number}</p>
    </div>;
  }, [props.number]);
};

// import { InitPageState } from './schemas/schemas-parser';

const renderComponentList = ['compId1'];

const IUBDSLRuntimeContainer = ({ dslParseRes }) => {
  const {
    layoutContent, componentParseRes, getCompParseInfo,
    schemas, mappingEntity,
    getSchemasInitValue,
    originSchemas,
  } = dslParseRes;

  const [state, setstate] = useState('嘻嘻哈哈');

  const ctx = {
    state
  };

  setTimeout(() => {
    setstate('呵呵嘻嘻');
  }, 5000);

  const actualRenderComponentList = useMemo(() => {
    const renderCompFactory = RenderComp(RenderComponentList);
    return renderComponentList.map((id) => ({
      compId: id,
      Comp: renderCompFactory(getCompParseInfo(id))
    }));
  }, [RenderComponentList]);

  return (
    <DefaultCtx.Provider value={ctx}>
      {/* <TempLayout> */}
      <FromWrapFactory>
        {actualRenderComponentList.map(({ compId, Comp }) => {
          return <Comp key={compId} extral={'扩展props'} suffix={state}/>;
        })}
      </FromWrapFactory>
      {/* {TableFactory()} */}
      {/* </TempLayout> */}
    </DefaultCtx.Provider>
  );
};

export default IUBDSLRuntimeContainer;

const TempLayout = ({ children }) => (
  <Layout>
    <Header className="header">
      <Menu theme="dark" mode="horizontal" defaultSelectedKeys={['2']}>
        <Menu.Item key="1">nav 1</Menu.Item>
        <Menu.Item key="2">nav 2</Menu.Item>
      </Menu>
    </Header>
    <Layout>
      <Sider width={200} className="site-layout-background">
        <Menu
          mode="inline"
          defaultSelectedKeys={['1']}
          defaultOpenKeys={['sub1']}
          style={{ height: '100%', borderRight: 0 }}
        >
          <SubMenu key="sub1" icon={<UserOutlined />} title="subnav 1">
            <Menu.Item key="1">option1</Menu.Item>
            <Menu.Item key="2">option2</Menu.Item>
          </SubMenu>
        </Menu>
      </Sider>
      <Layout style={{ padding: '0 24px 24px' }}>
        <Content
          className="site-layout-background"
          style={{
            padding: 24,
            margin: 0,
            minHeight: 480,
          }}
        >
          {children}
        </Content>
      </Layout>
    </Layout>
  </Layout>);
