/* eslint-disable no-param-reassign */
import { Subject } from 'rxjs';
import {
  ComplexType, FoundationType, Schemas
} from '@iub-dsl/types';
import schemasAnalysis from './analysis/analysis';
import { PATH_SPLIT_MARK, PATH_SPLIT_MARK_ARR } from './const';
import { PathMapInfoItem } from './analysis/i-analysis';

/** 树 / 多重嵌套 */
const sdId3 = { // 位置管理表格数据
  type: ComplexType.structArray,
  refTable: 'tableId1', // 整个结构引用得表
  desc: '位置管理表格数据',
  struct: {
    // 普通字段
    sdId1: {
      type: FoundationType.string,
      desc: '位置名字',
      fieldMapping: 'tableId1.filedId2',
    },
    // 复杂结构引用
    sdId3: {
      type: ComplexType.structObject,
      desc: '上级位置',
      fieldMapping: 'tableId1.filedId3', // 原表字段
      refTable: 'tableId2', // 复杂结构引用的表
      // TODO: 使用关系描述处理
      struct: {
        ssdId0: {
          type: FoundationType.string,
          fieldMapping: 'tableId2.filedId1',
          compTag: 'value', // 对外有映射的字段
        },
        ssdId1: {
          type: FoundationType.string,
          desc: '上级位置名字',
          fieldMapping: 'tableId2.filedId2',
          compTag: 'show',
        },
        // 多重引用
        ssdId2: {
          type: ComplexType.structObject,
          fieldMapping: 'tableId2.filedId3',
          refTable: 'tableId2',
          struct: {}
        },
        // 树形引用
        ssdId3: {
          type: 'structTreeArr',
        }
      }
    }
  }
};
/** 描述对象从[from]: any 转换成 [to]:any */
interface MapConf {
  from: string;
  to: string;
}
/** 映射的参数 */
interface MapDataParam<T> {
  pathKey: string;
  mapConf: MapConf;
  data: T | T[]
}

/**
 * 数据模型解析器
 * @param schemas 数据模型
 * @steps_1 分析页面数据模型
 * @steps_2 根据分析的关系数据, 实例基础工具类
 * @steps_3 解析
 * @steps_4 实例化状态管理
 */
const SchemasParser = (originSchemas: Schemas) => {
  const schemasAnalysisRes = schemasAnalysis(originSchemas);

  const { levelRelation } = schemasAnalysisRes;

  console.log(schemasAnalysisRes);
  return schemasAnalysisRes;
};

/**
 * 工具类有什么
 * 1. 搜索某个key相关得路径
 * 2. 获取某个key1-n个上级
 * 3. 获取某个key下级的所有key
 *
 * 方法:
 * 1. 有key, 具体往哪边查找
 * 2. 初始化一个全量
 * 3. 数据变化, 更新多个局部
 */

export default SchemasParser;
