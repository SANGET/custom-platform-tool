import { Injectable } from '@nestjs/common';
import axios from 'axios';

import { PreviewAppService } from 'src/preview-app/preview-app.service';

const mockToken = 'Bearer 1295915065878388737';

const prevParam = {
  mode: 'prod',
  lessee: 'hy',
  app: 'iot'
};

const genUrl = (params: any = {}) => {
  prevParam.lessee = params.lessee || prevParam.lessee;
  prevParam.app = params.app || prevParam.app;
  return `http://192.168.14.140:6090/paas/${prevParam.lessee}/${prevParam.app}`;
};

const flatLayoutNode = (layoutNode, parentID?) => {
  console.log(parentID);
  const componentsCollection = {};
  const layoutContentBody = [];
  layoutNode.forEach((nodeItem) => {
    // const nodeItemI = produce(nodeItem, draft => draft);
    const { id, body } = nodeItem;
    
    Object.assign(nodeItem, {
      type: 'componentRef',
      compType: nodeItem?.widgetDef?.type,
      // widgetDef: {
      // ...nodeItem.widgetDef,
      ...nodeItem.propState
      // }
    });
    // 删除内部字段
    Reflect.deleteProperty(nodeItem, '_classID');
    Reflect.deleteProperty(nodeItem, '_state');
    Reflect.deleteProperty(nodeItem, 'propState');
    Reflect.deleteProperty(nodeItem, 'widgetDef');
    
    componentsCollection[id] = Object.assign({}, nodeItem,
      parentID && {
        parentID
      });
    nodeItem.componentID = id;
    nodeItem.refID = id;
    layoutContentBody.push(nodeItem);
    
    if(body) {
      flatLayoutNode(body, id);
    }
  });
  return { componentsCollection, layoutContentBody };
};

const pickObjFromKeyArr = (obj, keyArr: string[]) => {
  return keyArr.reduce((res, key) => {
    res[key] = obj[key];
    return res;
  }, {});
};

const updateStateAction = (widgetId: string, schemas) => ({
  actionId: widgetId,
  actionName: 'updateState',
  actionType: 'updateState',
  actionOptions: {
    changeTarget: schemas
  },
  actionOutput: 'undefined'
});

const DEFALUT_FLOW_MARK = 'f_';

const genDefalutFlow = (id: string, out = []) => ({
  id: `${DEFALUT_FLOW_MARK}${id}`,
  actionId: `@(actions).${id}`,
  flowOutCondition: [],
  flowOut: [out]
});

const genFormInputDefaltAction = (widgetId: string) => ({
  onChange: {
    type: 'actionRef',
    actionID: `@(flow).${DEFALUT_FLOW_MARK}${widgetId}`
  }
});
const genFormButtonDefaltAction = (widgetId: string) => ({
  onClick: {
    type: 'actionRef',
    actionID: `@(flow).${DEFALUT_FLOW_MARK}${widgetId}`
  }
});

@Injectable()
export class PageDataService {

  constructor(
    private readonly previewAppService: PreviewAppService
  ) {}

  tempAction: any[] = [];
  
  tempFlow: any[] = [];

  tempSchema: any[] = [];

  tempWeight: any[] = [];

  mockDataSource =   {
    id: '1320563055356157952',
    version: null,
    createdBy: '1295915065878388737',
    modifiedBy: '1295915065878388737',
    gmtCreate: 1603681741000,
    gmtModified: 1603681741000,
    deleteFlag: null,
    pageInfoId: '1320554143869444096',
    pageCurrentVersion: '13',
    datasourceId: '1320554257547665408',
    datasourceName: null,
    datasourceType: 'TABLE'
  }

  mockColumn =  {
    id: 'schema_ZhqCfeGB',
    column: {
      id: '1320554987868266502',
      name: '用户',
      colDataType: 'NORMAL',
      fieldSize: 32,
      fieldType: 'STRING',
      fieldCode: 'username'
    },
    tableInfo: { id: '1320554257547665408', name: '用户表单', type: 'TABLE' }
  }

  genMetadataFromOnceTable(schema: any, onceTableInfo) {
    
    const columns = {};
    const schemaIds = Object.keys(schema);
    const { datasourceId, code } = onceTableInfo;
    if (!datasourceId) return {};
    const result = {
      id: datasourceId,
      code,
      name: '',
      type: 'general',
      moduleId: '', // 关联表Id
      columns
    };
    schemaIds.forEach((schemaId) =>{
      const schemaInfo = schema[schemaId];
      const { column, tableInfo } = schemaInfo;
      const { id: tableId, name: tableName } = tableInfo;
      const {
        id: columnId,
        name, colDataType,
        fieldSize, fieldType, fieldCode,
      } = column;
      if (tableId === datasourceId) {
        result.name = tableName;
        columns[columnId] = {
          id: columnId,
          name,
          /** 数据类型 */
          colDataType,
          /** 字段 size */
          fieldSize,
          /** 字段类型 */
          fieldType,
          /** 字段的名字 */
          fieldCode,
          type: 'string',
        };
      }
    });
    return result;
  }

  genMetadataFromTableInfo(onceTableInfo) {
    // tableInfo: { id: '1320554257547665408', name: '用户表单', code: 'yonghubiaodan' }
    const { columns: oldColumns, tableInfo } = onceTableInfo;
    const columns = oldColumns.map((info) => {
      return {
        id: info.id,
        name: info.name,
        fieldCode: info.code,
        fieldType: info.fieldType,
        fieldSize: info.fieldSize,
        dataType: info.dataType,
        colDataType: info.dataType,
        type: 'string',
      };
    }).reduce((res, val) => ({ ...res, [val.id]: val }), {});
    return {
      ...tableInfo,
      type: 'general',
      moduleId: '', // 关联表Id
      columns
    };;
  }

  transfromSchema(schema: any) {
    const schemaRes = {};
    const schemaIds = Object.keys(schema);
    schemaIds.forEach((schemaId) =>{
      const schemaInfo = schema[schemaId];
      const { column, tableInfo } = schemaInfo;
      const { id: tableId, name: tableName } = tableInfo;
      const {
        id: columnId, isPk, defaultVal
      } = column;
      schemaRes[schemaId] = {
        type: 'string',
        fieldMapping: `@(metadata).${tableId}.${columnId}`,
        defaultVal,
        isPk
      };
    });
    return schemaRes;
  }

  genFormInput(widgetData) {
    const { compType, field, id, title, defValue, type } = widgetData;
    /** 更改状态的动作 */
    this.tempAction.push(updateStateAction(id, `@(schemas).${field}`));
    /** 更改状态的流程项 */
    this.tempFlow.push(genDefalutFlow(id));
    return {
      id, compType, label: title, title, value: `@(schemas).${field}`,
      defValue, type, compCode: id,
      actions: {
        ...genFormInputDefaltAction(id)
      }
      // unit, placeholder, tipContent
    };
  }

  genFromButton(widgetData) {
    const { compType, field, id, title, type, actionRef } = widgetData;
    return {
      id, compType: 'NormalButton', title, label: title, text: title, type,
      actions: {
        ...genFormButtonDefaltAction(actionRef)
      }
    };
  }

  /** 收集整个页面的 */
  getDataCollectionFromSchema(schema) {
    const collectStructRes = [];
    const schemaIds = Object.keys(schema);
    schemaIds.forEach(id => {
      collectStructRes.push({
        field: `${schema[id].fieldMapping}`,
        collectField: `@(schemas).${id}`,
      });
    });
    return collectStructRes;
  }

  genAPBDSLAction(actionId: string, actionConf, pageSchema) {
    const { 
      action:{ 
        actionName,  actionType, forEntrieTable, targetTable
      }, 
      condition, event, preTrigger, triggerAction
    } = actionConf;

    const actualActionType = {
      create: 'TableInsert',
    };
    return {
      actionId,
      actionName,
      actionType: 'APBDSLCURD',
      actionOptions: {
        businesscode: '34562',
        actionList: {
          apbId1: {
            type: 'TableInsert',
            // type: actualActionType[actionType] || 'TableInsert',
            table: `@(metadata).${targetTable}`,
            fieldMapping: {
              actionId: `${actionId}dataCollection`,
              actionName,
              actionType: 'dataCollection',
              actionOptions: {
                collectionType: 'structObject',
                struct: this.getDataCollectionFromSchema(pageSchema) || []
              },
              actionOutput: {
                type: 'structObject',
                struct: []
              },
            },

          }
        },
        actionStep: ['apbId1']
      },
      actionOutput: 'undefined'
    };
  }

  genOpenPageAction(actionId: string, actionConf) {
    const { triggerAction, event, action: { pageID } } = actionConf;

    return {
      actionId,
      actionName: `openModal_${actionId}`,
      actionType: 'openModal',
      actionOptions: {
        type: 'iub-dsl',
        pageUrl: pageID,
        triggerAction,
        event
      },
      actionOutput: 'undefined'
    };
  }

  transfromAction(actions, { pageSchema }) {
    const res = {};
    const actionIds = Object.keys(actions);
    actionIds.forEach(id => {
      const action = actions[id][0];
      if (action) {
        const { triggerAction, event, action: { pageID } } = action;
        if (triggerAction === 'submit' && event === 'onClick') {
          res[id] = this.genAPBDSLAction(id, action, pageSchema);
          this.tempFlow.push(genDefalutFlow(id));
        }
        if (triggerAction === 'openPage' && pageID) {
          res[id] = this.genOpenPageAction(id, action);
          this.tempFlow.push(genDefalutFlow(id));
        }
      } else {
        console.error('获取action失败');
      }
    });

    return res;
  }

  transformWidgerData(widgetData, extralData) {
    const result = {};
    const widgetIds = Object.keys(widgetData);

    /** 傻做法 */
    let hasTable = false;
    const tableD = [];

    widgetIds.forEach((id) => {
      const onceWidgetData = widgetData[id];
      const { compType } = onceWidgetData;
      switch (compType) {
        case 'FormInput':
          result[id] = this.genFormInput(onceWidgetData);
          break;
        case 'FormButton':
          result[id] = this.genFromButton(onceWidgetData);
          break;
        case 'NormalTable':
          hasTable = true;
          result[id] = this.genTable(onceWidgetData);
          tableD.push(result[id]);
          break;
        default:
          result[id] = onceWidgetData;
          break;
      }
    });
    const extralSchema = this.genExtralSchema(extralData.tableMetaData, hasTable);
    if (hasTable) {
      this.genTableExtralData(tableD[0], extralSchema);
      this.addSearchWieght(extralSchema);
      this.addSearchBuntton(extralSchema);
    }
    
    return result;
  }

  addSearchWieght(extralSchema) {
    const { columns, id } = extralSchema;
    const widget = {
      type: 'componentRef',
      compType: 'FormInput',
      id: '',
      field: '',
      title: '',
      defValue: null,
    };
    Object.keys(columns).forEach(key => {
      const info = columns[key];
      if (info.isPk) return; 
      widget.id = info.schemaId;
      widget.field = info.schemaId;
      widget.title = info.name;
      this.tempWeight.push(
        this.genFormInput(widget)
      );
    });
  }

  addSearchBuntton(extralSchema) {
    const { columns, id } = extralSchema;
    const weightId = `button_${id}`;
    this.tempWeight.push({
      id: weightId,
      compType: 'NormalButton',
      title: '查询', label: '查询', text: '查询',
      type: 'componentRef',
      actions: {
        ...genFormButtonDefaltAction(weightId)
      }
    });
    const conditionList = {};
    const conditionControl = [];
    Object.keys(columns).forEach((key, i) => {
      const info = columns[key];
      if (info.isPk) return; 
      conditionList[`${key}_${i}`] = {
        operator: 'like',
        exp1: `@(metadata).${id}.${info.schemaId}`,
        exp2: `@(schemas).${info.schemaId}`,
      };
      conditionControl.push(`${key}_${i}`);
    });
    const updId = `${weightId}_U`;
    this.tempAction.push(
      {
        actionId: weightId,
        actionName: `${weightId}TableSelect`,
        actionType: 'APBDSLCURD',
        actionOptions: {
          businesscode: '34562',
          actionList: {
            apbA1: {
              type: 'TableSelect',
              table: `@(metadata).${id}`,
              condition: {
                conditionControl: {
                  and: conditionControl
                },
                conditionList
              },
            }
          },
          actionStep: ['apbA1']
        },
        actionOutput: 'string', // TODO
      }, 
      updateStateAction(updId, `@(schemas).${id}`)
    );
    this.tempFlow.push(
      genDefalutFlow(weightId, [DEFALUT_FLOW_MARK+updId]),
      genDefalutFlow(updId),
    );
  }

  genTableExtralData(tableData, data) {
    const { columns, id } = data;
    tableData.columns = Object.keys(columns).filter(key => !columns[key].isPk).map(key => ({
      dataIndex: columns[key].fieldCode,
      key: columns[key].schemaId,
      title: columns[key].name,
    }));
    tableData.dataSource = `@(schemas).${id}`;
  }

  genTable(widgetData) {
    const { compType, id, label, type } = widgetData;
    return {
      id, label, type, compType,
      columns: [],
      dataSource: '',
    };
  }

  genExtralSchema(tableMetadata, isAll = false) {
    if (tableMetadata) {
      const { columns, id } = tableMetadata;
      const coulumsIds = Object.keys(columns);
      const cc = coulumsIds?.map((coulumsId) => {
        const info = columns[coulumsId];
        if (info.dataType === 'PK') {
          return {
            schemaId: info.id,
            name: info.name,
            type: 'string',
            fieldMapping: `@(metadata).${id}.${info.id}`,
            isPk: true,
            fieldCode: info.fieldCode,
            defaultVal: '$ID()'
          };
        } 
        if (isAll) {
          return {
            name: info.name,
            schemaId: info.id,
            type: 'string',
            fieldCode: info.fieldCode,
            fieldMapping: `@(metadata).${id}.${info.id}`,
          };
        }
        return null;
      }).filter(v => v);
      if (isAll) {
        const structArr = {
          schemaId: id,
          collectionType: 'structArray',
          struct: cc
        };
        this.tempSchema.push(structArr);
      }
      this.tempSchema.push(...cc);
      return { columns: cc, id };
    }
    return null;
  }

  async getTableMetadata(dataSources) {
    return await this.getTableInfoFromRemote(dataSources[0].datasourceId);
    //   const schemaPk = this.tableInfoToSchema(columns, tableInfo);
  }

  /**
   * 页面数据转 IUB-DSL 数据
   * @param pageData 
   */
  pageData2IUBDSL(pageData, extralData) {
    const { pageContent, dataSources } = pageData;
    const { tableMetaData } = extralData;
    let contentData;
    // console.dir(pageData);
    const IUBDSLData = {
      sysRtCxtInterface: {},
      schemas: {},
      metadataCollection: [],
      relationshipsCollection: {},
      componentsCollection: {},
      actionsCollection: {},
      flowCollection: {},
      layoutContent: {},
      pageID: '',
      name: '',
      type: '',
    };
    try {
      contentData = JSON.parse(pageContent);
      const { content: pageLayoutContent, meta: { schema, actions } } = contentData;
      
      const { componentsCollection, layoutContentBody } = flatLayoutNode(pageLayoutContent);

      /** 生成元数据 */
      const actualMetadata = this.genMetadataFromTableInfo(tableMetaData);
      extralData.tableMetaData = actualMetadata;
      // const actualMetadata = this.genMetadataFromOnceTable(actualSchema, dataSources[0]);
      // const actualMetadata = dataSources.map((onceTableInfo) => this.genMetadataFromOnceTable(actualSchema, onceTableInfo));
      
      /** 转换组件集合 */
      const widgetC = this.transformWidgerData(componentsCollection, extralData);
      const actualComponentsCollection = Object.assign({}, 
        this.tempWeight.reduce((res, val) => ({ ...res, [val.id]: val }), {}),
        widgetC
      );
      
      /** 转换schemas */
      const actualSchema = Object.assign({}, 
        this.tempSchema.reduce((res, val) => ({ ...res, [val.schemaId]: val }), {}),
        this.transfromSchema(schema),
      );


      /** 转换动作 */
      const actualActions = Object.assign({}, 
        this.tempAction.reduce((res, val) => ({ ...res, [val.actionId]: val }), {}),
        this.transfromAction(actions, { pageSchema: actualSchema })
      );
      /** 转换流程 */
      const actualFlowCollection = this.tempFlow.reduce((res, val) => ({ ...res, [val.id]: val }), {});


      IUBDSLData.layoutContent = {
        type: 'general',
        content: layoutContentBody
      };
      IUBDSLData.pageID = contentData.id || 'testIDs';
      IUBDSLData.name = contentData.name;
      IUBDSLData.type = 'config';
      IUBDSLData.componentsCollection = actualComponentsCollection;
      IUBDSLData.metadataCollection = [actualMetadata];
      IUBDSLData.schemas = actualSchema;
      IUBDSLData.actionsCollection = actualActions;
      IUBDSLData.flowCollection = actualFlowCollection;

      this.tempFlow.length = 0;
      this.tempAction.length = 0;
      this.tempSchema.length = 0;
      this.tempWeight.length = 0;
    } catch(e) {
      console.log(e);
      contentData = pageContent;
    }
    return IUBDSLData;
  }

  

  async getTableInfoFromRemote(tableId) {
    const reqUrl = `${genUrl()}/data/v1/tables/${tableId}`;
    const resData = await axios
      .get(reqUrl, {
        headers: {
          Authorization: mockToken
        }
      });
    const data = resData?.data?.result;
    
    const tableInfo = {
      id: data.id,
      name: data.name,
      code: data.code
    };
    /**
      create_user_id    '随便填个数字'
      last_update_user_id    '随便填个数字'
      sequence    '随便填个数字'
      last_update_time    '随便填个年月日'
      create_time    '随便填个年月日'
      data_version    '随便填个字符串'
      last_update_user_name '非必填'
      create_user_name '非必填'
    */
    const filterSysFiledKeys = ['create_user_id', 'last_update_time', 'last_update_user_id', 'sequence', 'create_time', 'data_version', 'last_update_user_name', 'create_user_name']; 

    return {
      tableInfo,
      columns: data.columns?.filter(info => !filterSysFiledKeys.includes(info.code))
    };
  }

  /** 获取表格组件的cloumn */
  tableInfoToSchema(columns: any[], tableInfo, isAll = false) {
    const res = {};

    const columnKey = ['id', 'name', 'colDataType', 'fieldSize', 'fieldType', 'fieldCode'];
    columns.forEach((info) => {
      if (info.dataType === 'PK') {
        res[info.id] = {
          column: {
            ...pickObjFromKeyArr(info, columnKey),
            fieldCode: info.code,
            isPk: true,
            defaultVal: '$ID()'
          },
          tableInfo
        };
      } else  if (isAll) {
        res[info.id] = {
          column: {
            ...pickObjFromKeyArr(info, columnKey),
            fieldCode: info.code,
          },
          tableInfo
        };
      }
    });
    return res;
  }

  /**
   * 从远端获取页面数据
   */
  async getPageDataFromRemote({
    lessee,
    app,
    id
  }): Promise<any> {
    const token = this.previewAppService.getToken(lessee);
    const reqUrl = `${genUrl({ lessee, app })}/page/v1/pages/${id}`;
    try {
      const resData = await axios
        .get(reqUrl, {
          headers: {
            Authorization: mockToken
          }
        });
      const data = resData?.data?.result; 
      let tableMetaData = null;
      if (data) {
        const { dataSources } = data;
        tableMetaData = await this.getTableMetadata(dataSources);
      }

      return this.pageData2IUBDSL(data, { tableMetaData });
    } catch(e) {
      return e;
    }
  }
}
// `http://192.168.14.140:6090/paas/hy/app/page/v1/pages/1308242886768336896`