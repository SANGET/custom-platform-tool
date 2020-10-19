import React, { PureComponent } from 'react';
import { Row, Col, ConfigProvider } from 'antd';
import zhCN from 'antd/es/locale/zh_CN';
import MeunsTree from './components/MenusTree';
import Table from './components/Table';

import "./index.less";

interface IProps {
  children: React.ReactNode
}
interface IMenuInstance {
  reload: () => void;
}
interface IState {
  moduleId: string;
}
class DataDesign extends PureComponent<IProps, IState> {
  public menuRef = React.createRef<IMenuInstance>()

  constructor(props: IProps) {
    super(props);
    this.state = {
      moduleId: "",
    };
  }

  /**
   * 点击树选中
   * @param id
   */
  public handleTreeSelect = (id) => {
    const { moduleId } = this.state;
    if (id === moduleId) return;
    this.setState({
      moduleId: id
    });
  }

  /**
   * 更新树菜单
   */
  public handleUpdataMenus = () => {
    this.menuRef?.current?.reload();
  }

  public render() {
    const { moduleId } = this.state;
    return (
      <ConfigProvider locale={zhCN}>
        <Row className="data-design-layout">
          <Col xs={24} sm={8} md={7} lg={7} xl={5} className="sider-menu-tree">
            <MeunsTree
              ref={this.menuRef}
              onSelect={this.handleTreeSelect}
            />
          </Col>
          <Col xs={24} sm={16} md={17} lg={17} xl={19} className="content-pro-table">
            <Table
              moduleId={moduleId}
              updataMenus={this.handleUpdataMenus}
            />
          </Col>

        </Row>
      </ConfigProvider>);
  }
}
export default DataDesign;
