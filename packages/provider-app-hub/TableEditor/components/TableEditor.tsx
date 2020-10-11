import React from 'react';
import { FormInstance } from 'antd/lib/form';
import { getUrlParams } from "@mini-code/request/url-resolve";
import { Button, Tag, Tabs } from 'antd';
import { Link } from "multiple-page-routing";
import { getTableInfo } from '../apis';
import { ITableInfoFromApi, ITableInfoInState } from '../interface';
import BasicInfoEditor from './BasicInfoEditor';

const { TabPane } = Tabs;
class TableEditor extends React.Component {
  state: ITableInfoInState = {
    /** 表基本信息 */
    basicInfo: {
      id: '',
      /** 表名 */
      tableName: '',
      /** 编码 */
      tableCode: '',
      /** 表类型 */
      tableType: 'TABLE',
      /** 所属模块 */
      relatedModuleId: '',
      /** 主表编码（表类型为附属表时起作用 */
      mainTableCode: '',
      /** 主表名（表类型为附属表时起作用 */
      mainTableName: '',
      /** 最大层级（表类型为树形表时起作用 */
      maxLevel: 0,
      /** 表创建类型 */
      species: 'SYS'
    },
    /** 关联页面 */
    relatedPages: [],
    /** 表扩展信息 */
    /** 字段列表 */
    fieldList: [],
    /** 引用字段列表 */
    referenceList: [],
    /** 外键字段列表 */
    foreignKeyList: []
  };

  basicInfoFormRef = React.createRef<FormInstance>();

  constructor(props) {
    super(props);
    this.state = {
      /** 表基本信息 */
      basicInfo: {
        id: '',
        /** 表名 */
        tableName: '',
        /** 编码 */
        tableCode: '',
        /** 表类型 */
        tableType: 'TABLE',
        /** 所属模块 */
        relatedModuleId: '',
        /** 主表编码（表类型为附属表时起作用 */
        mainTableCode: '',
        /** 主表名（表类型为附属表时起作用 */
        mainTableName: '',
        /** 最大层级（表类型为树形表时起作用 */
        maxLevel: 0,
        /** 表创建类型 */
        species: 'SYS'
      },
      /** 关联页面 */
      relatedPages: [],
      /** 表扩展信息 */
      /** 字段列表 */
      fieldList: [],
      /** 引用字段列表 */
      referenceList: [],
      /** 外键字段列表 */
      foreignKeyList: []
    };
    this.basicInfoFormRef = React.createRef<FormInstance>();
    this.expandInfoFormRef = React.createRef<FormInstance>();
  }

  componentWillMount() {
    const id = this.getTableId();
    getTableInfo(id).then((res) => {
      this.constructInfoFromRequest(res);
    });
  }

  /** 从路径上获取表主键，以获取表详情数据 */
  getTableId() {
    const urlParam = getUrlParams(undefined, undefined, true);
    return urlParam.id;
  }

  /** 将接口数据设置到 state 上 */
  constructInfoFromRequest(param: ITableInfoFromApi) {
    const {
      name, code, type, moduleId, auxTable, treeTable, columns, references, foreignKeys, id,
      relationTables: relatedPages, species
    } = param || {};
    const mainTableName = auxTable?.parentTable?.name;
    const mainTableCode = auxTable?.parentTable?.code;
    const maxLevel = treeTable?.maxLevel;
    const newState = {
      basicInfo: {
        id,
        tableName: name,
        tableCode: code,
        tableType: type,
        relatedModuleId: moduleId,
        mainTableCode,
        mainTableName,
        maxLevel,
        species
      },
      relatedPages: [{ id: '1314492623335071744', name: "测试页面" }],
      fieldList: columns,
      /** 引用字段列表 */
      referenceList: references,
      /** 外键字段列表 */
      foreignKeyList: foreignKeys
    };
    this.setState(newState);
    this.basicInfoFormRef?.current?.setFieldsValue({ ...newState.basicInfo });
  }

  constructInfoForSave() {

  }

  /** 保存数据 */
  handleSave() {}

  /** 切换tab页 */
  handelChangeTab() {}

  render() {
    const { basicInfo, relatedPages } = this.state;
    return (
      <>
        <BasicInfoEditor
          className="w-4/5 float-left"
          formRef={this.basicInfoFormRef}
          basicInfo={basicInfo}
        />
        <div className="w-1/5 float-left">
          <Button className="ml-2 float-right">取消</Button>
          <Button
            type="primary"
            className="float-right"
            onClick={this.handleSave}
          >保存</Button>
        </div>
        <div className="flex w-full related-pages mb-2">
          <div className="flex-initial" style={{ width: '80px' }}>关联页面：</div>
          <div className="flex-initial link-page-tags flex-grow">
            {relatedPages?.map(({ id, name }) => (
              <Link
                key={id}
                to='/page-designer'
                pathExtend={id}
                params={{
                  title: name,
                  /** 必须要的页面 id */
                  pageID: id
                }}
              >
                <Tag key={id}>{name}</Tag>
              </Link>
            ))}
          </div>
        </div>
        <Tabs onTabClick={this.handelChangeTab} type="card" style={{ width: "100%" }}>
          <TabPane tab="表字段" key="columns">

          </TabPane>
          <TabPane tab="引用表" key="references">
          </TabPane>
          <TabPane tab="外键设置" key="foreignKeys">
          </TabPane>
        </Tabs>
      </>
    );
  }
}
export default TableEditor;
