/**
 * 界面变量
*/
import React, { ReactElement, PureComponent } from 'react';
import {
  Tabs, Card, Table, Tooltip, Button
} from 'antd';
import { equals } from './util';
import { IParams } from './interface';
import ParamsModal from './paramModal';
import "./style.less";

const { TabPane } = Tabs;

interface IProps {
  params: string[]
}

interface IState {
  currentFuncParams: IParams[];
  currentPageParams: IParams[];
  currentSysParams: IParams[];
  visible: boolean;
  changeParams: IParams;
  activeKey: string;
}
interface IColumns {
  title: string;
  dataIndex: string;
  key: string;
  render?: (text: string, record: any, index: number) => ReactElement;
}
class Variable extends PureComponent<IProps, IState> {
  private funcColumns:IColumns[] = [
    {
      title: '字段',
      dataIndex: 'key',
      key: 'key',
    },
    {
      title: '参数名',
      dataIndex: 'name',
      key: 'name',
    }, {
      title: '参数值',
      dataIndex: 'value',
      key: 'value',
      render: (text: string, record: any, index: number) => (
        <div key={index} className="func-table-col">
          <Tooltip placement="topLeft" title={text}><span className="func-table-text">{text}</span></Tooltip>
          <a onClick={() => this.handleEidtValue(text, record, index)}>编辑</a>
        </div>)
    }
  ]

  constructor(props: IProps) {
    super(props);
    this.state = {
      currentFuncParams: [],
      currentPageParams: [{
        key: "orderTime",
        name: "下单时间",
        value: "2020-3-8",
        type: "String",
      }, {
        key: "contact",
        name: "联系人",
        value: "张三",
        type: "String",
      }],
      currentSysParams: [{
        key: "sysTime",
        name: "系统时间",
        value: new Date().getTime(),
        type: "String",
      }, {
        key: "user",
        name: "系统用户",
        value: "管理员",
        type: "String",
      }],
      visible: false,
      changeParams: {},
      activeKey: "currentFuncParams",
    };
  }

  public handleEidtValue(text: string, record: any, index: number) {
    this.setState({
      visible: true,
      changeParams: { ...record, index }
    });
  }

  public getParmasData() {
    const paramsData: IParams[] = [];
    const { params } = this.props;
    params.map((item) => {
      paramsData.push({
        key: item,
        name: `参数${item}`,
        value: "",
        type: "String",
      });
    });
    return paramsData;
  }

  componentDidUpdate(prevProps: IProps) {
    if (!equals(prevProps.params, this.props.params)) {
      const paramsData = this.getParmasData();
      this.setState({
        currentFuncParams: paramsData
      });
    }
  }

  public handleFinsh = (values: IParams) => {
    const { index } = values;
    const { activeKey } = this.state;
    this.state[activeKey][`${index}`] = values;
    // @ts-ignore
    this.setState({
      visible: false,
      [`${activeKey}`]: [...this.state[activeKey]]
    });
  }

  public handleTabsChange = (activeKey: string) => {
    this.setState({ activeKey });
  }

  public handleCancel = () => {
    this.setState({
      visible: false
    });
  }

  public getCurrentParmas = () => {
    const { currentFuncParams, currentPageParams, currentSysParams } = this.state;
    return [
      ...currentFuncParams, ...currentPageParams, ...currentSysParams
    ];
  }

  render() {
    const {
      currentFuncParams, visible, changeParams, currentPageParams, currentSysParams, activeKey
    } = this.state;
    return (
      <>
        <div className="variable">
          <Card title="页面变量" style={{ width: 300 }}>
            <Tabs
              onChange={this.handleTabsChange}
              activeKey={activeKey}
            >
              <TabPane tab="当前函数" key="currentFuncParams">
                <Table
                  dataSource={currentFuncParams}
                  columns={this.funcColumns}
                  size="small"
                  pagination={false}
                  locale={{
                    emptyText: "未获取到函数任何参数"
                  }}
                />
              </TabPane>
              <TabPane tab="当前界面" key="currentPageParams">
                <Table
                  dataSource={currentPageParams}
                  columns={this.funcColumns}
                  size="small"
                  pagination={false}
                  locale={{
                    emptyText: "未获取到函数任何参数"
                  }}
                />
              </TabPane>
              <TabPane tab="系统变量" key="currentSysParams">
                <Table
                  dataSource={currentSysParams}
                  columns={this.funcColumns}
                  size="small"
                  pagination={false}
                  locale={{
                    emptyText: "未获取到函数任何参数"
                  }}
                />
              </TabPane>
            </Tabs>
          </Card>
        </div>
        <ParamsModal
          onFinish={this.handleFinsh}
          onCancel={this.handleCancel}
          visible={visible}
          params={changeParams}
        />
      </>
    );
  }
}
export default Variable;
