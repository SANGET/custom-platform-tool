// 虚线是依赖：依赖不需要知道你的实现
// 实线是关联：关联需要知道你的实现(方法、属性)
// 单一职责：内部模块只有一种。对外可以扩展很多种。
// 微内核、插件式系统
// 抽象各种关系做成类

// 我们会考虑/有考虑到我们的设计里面去的

// 1. 用户关联部门。
// 2. 统计部门下有多少用户
// 3.

// 1. 预编译，转成伪代码

/**
 * 解析器职能
 * 1. IUB-DSL解析引擎：解析6大块、产出数据模型、HTML、解析完整的业务
 *   1.1. 解析action业务： 解析出每个单个可运行代码块
 *   1.2. 解析关系业务： 分析关系，额外生成代码块
 * 2. IUB-DSL运行容器(pageContext)：
 * 3. 运行容器数据调度器(sysContext)：
 */

// 表和表直接的关联关系：强、弱

/**
 * 1. 单个流程运行时的变量符号
 * 2. 页面上下文的变量符号
 * 3. 页面方法
 * 4. 单步流程调用
 * 5. 一组流程的调用
 * 6. 使用结果(依赖)、调用(关联)
 */

// TODO: 不同地方配置的APB-DSL支持合并成一步操作

/** 解析解析引擎总入口 */
interface ParseIUB_DSL {
  /** 分发解析IUB_DSL */
  distributionParse(IUB_DSL: TypeOfIUBDSL): IUBParseResult;
}

/**
 * 职能：
 *   1. 描述数据源之间的关系
 *   2. 映射真实的字段给到外部
 *   3. 提供获取
 */

/** 解析元数据映射 */
interface ParseMetaDataMapping {
  /** 表映射集合 */
  tableMappingCollection: TableMapping;

  /** 字段关系描述映射 */
  filedRelationMapping: RelationMapping;

  /** 解析数据源 */
  parseDataSource(dataSorce: DataSorce): MappingCollection;
  /** 解析数据源关系 */
  parseDataSorceRelation(dataSourceRelation: DataSourceRelation): Relations;

  // 关系思考？？
  // 附属表，fid引用table
  // 用户的部门ID
  // 查询某个uuid的关系

}

const tableMappingCollection = {
  dataSourceId1: 'User'
};

const mappingCollection = {
  // uuid2: 'dataSourceId2.department', // faild
  uuid3: {
    field: 'dataSourceId2.department',
    relation: '',
  }
};

// store + dispatch标准
/** 解析数据模型 */
interface ParseSchema {
  /** 解析页面数据模型 */
  parsePageSchema(pageSchema: PageSchema, isAutoInit: boolean): PageStore;
  /** 解析页面数据模型的校验规则 */
  ParseRules(pageSchemaItem: PageSchemas): PageStore;
  /** 解析流程上下文数据模型 */
  ParseFlowSchema(flowSchema: FlowSchemas): FlowStore;
  /** 解析系统上下文数据模型 */
  ParseSystemSchema(sysSchema: SysSchema): SysInterfance;
}

/** 解析布局 */
interface ParseLayout {
  /** 解析布局信息 */
  parseLayout(layoutContent: LayoutContent): LayoutInfo;
  /** 讲AST解析成可运行的DOM配置信息 */
  parseASTtoDOM(layoutAst: LayoutInfo): DOMTreeInfo;
  /** 解析单条布局信息 */
  parseLayoutItem(layoutContentItem: LayoutContentItem): LayoutInfo;
  /** 解析组件信息 */
  parseComponent(UIInfo): CompInfo;
  /** 获取对应的组件UI信息 */
  getUI(compItemConf: ComponentItemConf): UIInfo;
  /** 获取布局信息 */
  getLayout(layoutConf: LayoutConf): LayoutInfo;

}

/** 解析action业务 */
interface ParseActionCollection {
  /** 解析单个流程控制节点 */
  parseFlowItem(flowItem: FlowItem): FnFragment;
  /** 解析整个流程控制 */
  parseParseFlowControl(actionItem: ActionItem): FnFragment;
  /** 解析表达式 */
  parseExpression(expression: string): ExpressionRes;
  /** 解析字符串模板 */
  parseStringTemplate(stringTemp: string): FnFragment;
  /** 解析关键字 */
  parseKeyword(keyword: Keyword): FnFragment;
}

/** 解析关系集合 */
declare namespace ParseRelationCollection {
  /** 解析数据变更关系 */
  interface ParseDataSorceRelation { }
  /** 其他扩展关系的解析 */
  interface ParseXXXRelation { }
}

interface RuntimeContainer {

}

interface Button {}

declare namespace AntdUI {
  interface Button {

  }
}
