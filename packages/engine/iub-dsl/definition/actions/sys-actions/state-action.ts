import { BasicActionConf } from "..";

// 改变页面运行时状态 [可对应: 回填、输入、赋值给控件、联动的动作的赋值部分]
const testStruct = {
  type: 'updateState',
  changeTarger: '@(dataCollection).collectId1', // schemas/dataCollect
  changeMapping: {
    '@(metadataMapping).tableId1.filedId1': '@(schemas).dId0',
    '@(metadataMapping).tableId1.filedId2': '@(schemas).dId1',
    // '@(metadataMapping).tableId1.filedId3': '@(schemas).dId3', // TODO?
    '@(metadataMapping).tableId1.filedId3': '@(schemas).dId3.sdId1',
    '@(metadataMapping).tableId1.filedId4': '@(schemas).dId2',
  },
  when: [],
  conition: {},
};

/** 动作更新运行时状态、 控件赋值 */
export interface UpdateState extends BasicActionConf {
  type: 'updateState';
  /** 方式1: A To B 的映射 */
  changeMapping?: {
    [mapFrom: string]: string;
  }
  /** 方式2: 根据目标信息, 反向映射「如: schemas的描述/数据收集关系」 */
  changeTarget?: string;
}
