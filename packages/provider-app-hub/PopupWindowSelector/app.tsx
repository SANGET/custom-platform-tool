import React, { PureComponent } from 'react';
import { Row, Col } from 'antd';
import MeunsTree from './components/MenusTree';
import PopupWindowSelector from './components/PopupWindowSelector';
import "./index.less";

interface IProps {
  children: React.ReactNode
}
interface IMenuInstance {
  reload: () => void;
}
interface IState {
  showType: string;
}
class DataDesign extends PureComponent<IProps, IState> {
  public menuRef = React.createRef<IMenuInstance>()

  constructor(props: IProps) {
    super(props);
    this.state = {
      showType: ""
    };
  }

  /**
   * 点击树选中
   * @param id
   */
  public handleTreeSelect = (id) => {
    const { showType } = this.state;
    if (id === showType) return;
    this.setState({
      showType: id
    });
  }

  /**
   * 更新树菜单
   */
  public handleUpdataMenus = () => {
    this.menuRef?.current?.reload();
  }

  public render() {
    const { showType } = this.state;
    return (
      <Row className="data-design-layout">
        <Col xs={24} sm={8} md={7} lg={7} xl={5} className="sider-menu-tree">
          <MeunsTree
            ref={this.menuRef}
            onSelect={this.handleTreeSelect}
          />
        </Col>
        <Col xs={24} sm={16} md={17} lg={17} xl={19} className="content-pro-table">
          <PopupWindowSelector
            showType={showType}
            updataMenus={this.handleUpdataMenus}
          />
        </Col>

      </Row>);
  }
}
export default DataDesign;
