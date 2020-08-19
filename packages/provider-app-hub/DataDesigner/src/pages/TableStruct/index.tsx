/*
 * @Author: wangph
 * @Date: 2020-07-10 12:00:29
 * @Last Modified by:   wangph
 * @Last Modified time: 2020-07-10 12:00:29
 */

import React, {
  FC, useState, useEffect, useCallback
} from 'react';
import { Modal, Form } from 'antd';

/** 网络请求工具 */
import Http, { Msg } from '@infra/utils/http';

/** 状态管理方法 */
import { useMappedState, useDispatch } from 'redux-react-hook';

/** 基本表单 */
import BasicForm from '@provider-app/data-designer/src/components/BasicForm';

/** 表类型枚举--表格列代码转文字时也要用 */
import { TableTypeEnum } from '@provider-app/data-designer/src/tools/constant';

/** 树操作方法 */
import { treeQuery } from '@provider-app/data-designer/src/tools/tree';

/**
* 模态框默认配置
*/
import { getModalConfig } from '@provider-app/data-designer/src/tools/mix';
/** GMT时间格式化 */
import { formatGMT } from '@provider-app/data-designer/src/tools/format';

/** 菜单树业务组件 */
import MenuTree from '@provider-app/data-designer/src/bizComps/MenuTree';

/** 表单业务组件 */
import { GetMenuTree } from '@provider-app/data-designer/src/api';
import StructForm from './StructForm';

/** 表头菜单组件 */
import StructHeadMenu from './StrcutHeadMenu';

/** 表格业务组件 */
import List from './List';

/** 当前功能页样式 */
import './TableStruct.less';
import { Connector } from '../../tools/connector';

/** 给你一些使用react hook的理由  */
/** 理由一： hook使你无需更改页面结构,也能在不同的组件间复用状态,为了在组件间复用状态,providers,consumers,render Props、高阶组件这类方案需要更改页面结构
 *         通过抽象层组成的组件解决将可复用状态附加到组件路径的做法会形成嵌套地狱
 */
/** 理由二： 复杂组件更易理解  状态逻辑和副作用充斥在组件中,使简单组件变得复杂,在hook中可以用内置暴露的reduces管理这些状态,此外,相互关联且需要对照修改的代码被拆分到不同的生命周期中 */
/**         hook将相互关联的拆分成更小的函数，而并非强制按照生命周期划分 */
/**  理由三 函数式组件比class组件更容易理解, 在函数组件中,很好理解props，state 和自顶向下的数据流，但在class组件中却一筹莫展，class组件中this的工作方式也不好理解 */
/**  理由四 从概念上来讲React组件更像函数,而hook拥抱了函数,class组件不能很好的压缩,热重载不稳定,class组件会使component folding优化措施无效 */
/** 给你一些使用函数组件的理由 */
/** 1.babel/ts 做 class transformation 的时候会产生额外的函数调用 */
/** 2.class component 存在 life-cycle 检查 & 执行 */
/** 3.function component 在 uglify 时可压缩的空间大于 class component */
/** 4.function component 更为轻量 */

/**
 * 给你使用ts的一些理由
 *1. 静态类型检查-静态类型检查可以避免很多不必要的错误
 *2. IDE 智能提示-可以提高编码的效率
 *3. 有利于书写自描述的代码(类型即文档);
 *4. 方便代码重构(配合 IDE 可以自动重构).
 */

/**
* useState和useReducer该如何选择
* 如果 state 只想用在 组件内部，建议使用 useState，如果想维护全局 state 建议使用 useReducer
* 如果 state 的类型为 Number, String, Boolean 建议使用 useState，如果 state 的类型 为 Object 或 Array，建议使用 useReducer
* 如果 state 变化非常多，也是建议使用 useReducer，集中管理 state 变化，便于维护
* 如果 state 关联变化，建议使用 useReducer
* 业务逻辑如果很复杂，也建议使用 useReducer
* */

/* useCallback就是处理父组件重复无用的调用子组件的方法，useMemo处理属性重复无用的调用的 */
/**
* useMemo用法,父组件没有属性传递给子组件时,为了减少父组件状态改变时，子组件不必要的渲染,要用useMemo包裹一下子组件
* */
/* 当父组件传递状态给子组件的时候，memo没什么效果 要引入hooks的useCallback、useMemo这两个钩子。 */
/* useCallback(() => {},[]) */
/* 使用useCallback优化了传递给子组件的函数，只初始化一次这个函数，下次不产生新的函数 */

/**
* dispatch后组件渲染两次的原因
* 最近的react版本,dev模式下render使用的是strict mode,strict mode的通过两次调用constructor和render函数来更好的检测不符合预期的side effects
* 下列函数会执行两次:
* 类组件的constructor,render和shouldComponentUpdate方法
* 类组建的静态方法getDerivedStateFromProps
* 函数组件方法体
* 状态更新函数(setState的第一个参数)
* 传入useState,useMemo或useReducer的函数
* 在production环境下不会这样,所以不用担心
*/

/**
数据驱动，对表单的任何操作都可以通过操作配置数据完成。
高维护性，维护表单，只需要维护配置数据。
 */

const TableStruct: FC = () => {
  // 定义一个 mapState函数
  const mapState = useCallback(
    (state) => ({
      treeData: state.treeData,
    }),
    []
  );

  /** 在网络请求工具中,要用dispatch更改共享状态 */
  const dispatch = useDispatch();
  /** structPager显示列表序号的时候要用 treeData 左侧菜单树要用 */
  /**
   * 共享状态值--表结构分页和树形源数据
   * */
  const { treeData } = useMappedState(mapState);

  const [structTableData, setStructTableData] = useState([]);

  /** 设置模块框的显示隐藏 */
  const [visible, setVisiable] = useState<boolean>(false);
  /**
  * 对json文件的格式要求极其严格,数组最后一项多加一个逗号,返回结果会变成null
  */

  /**
   * 表结构列表查询
   * @param treeData-菜单树,用于菜单id转文字
   * @param TableTypeEnum-表类型枚举,用于表类型转文字
   * @param formatGMT-gmt时间格式转yyyy-MM-dd hh:mm:ss
   *
   */
  const queryList = async (args = {}) => {
    /**
     * 与产品约定,左侧树查询不考虑右侧列表查询条件,右侧列表查询要带上左侧查询条件,点击了搜索按钮之后才查询
     */
    const params = Object.assign({}, {
      /**  String 否 数据表名称 */
      name: '',
      /**  long 否 模块主键 */
      moduleId: '',
      /**  String 否 表类型normalTable(普通表)tree(树形表)auxTable(附属表) */
      type: '',
      /**  int 是 分页查询起始位置,从0开始 */
      offset: 0,
      /**  int 是 每页查询记录数 */
      size: 10
    }, args);
    /** 请求表结构列表数据 */
    // const tableRes = await Http.get('http://localhost:60001/mock/structList.json', { params });
    const tableRes = await Http.get('/data/v1/tables/list', { params });

    // console.log({ tableRes });

    /** 表格数据格式转换-注意setStructTableData之后不能立刻获取最新值 */
    const tableData = tableRes.data.result.data.map((col) => {
      /** 根据T点的key查找节点完整信息 */
      /** 返回节点的名称 */
      col.moduleId = treeQuery(treeData, col.moduleId).title;
      // console.log(col.moduleId);
      /** 将表类型代码转换为文字 */
      const showText = TableTypeEnum.find((item) => item.value === col.type);
      col.type = showText ? showText.text : '';
      /** gmt时间格式转yyyy-MM-dd hh:mm:ss */
      col.gmtCreate = formatGMT(col.gmtCreate);
      col.gmtModified = formatGMT(col.gmtModified);
      /** antd table每行记录必需有key字段 */
      col.key = col.id;
      return col;
    });
    // console.log({ structTableData });
    // setTableData(structTableData);
    setStructTableData(tableData);
  };

  const getPageData = async () => {
    /** 请求菜单树,表结构的表类型列依赖菜单树数据 */
    // const menuTreeRes = await Http.get('http://localhost:60001/mock/menu.json');
    // const menuTreeRes = await Http.get('/page/v1/menus/list');
    // const tData = listToTree(menuTreeRes.data.result);

    const tData = await GetMenuTree();

    dispatch({ type: 'setTreeData', treeData: tData });
    // console.log({ treeData });
    queryList();

    // console.log(tData);
  };
  /**
  * useEffect第二个值传空数组,是告诉react不要追踪任何值的变化，只运行一次
  * 有效模拟componentDidMount事件
  */
  useEffect(() => {
    /**
    * 获取左侧菜单树和列表数据
    */
    getPageData();
  }, []);

  /** 表格属性 */
  const tableProps = {
    treeData,
    queryList,
    setData: (data) => {
      setStructTableData(data);
    },
    tableData: structTableData,
    /**
     * 分页查询
     * offset-页码 size-每页展示数量
     */
    pagination: (offset, size) => {
      queryList({ offset, size });
    },
    scroll: {
      /** 必须设置，不然表格列过多时内容会撑开容器,并且不能设置成true,要设置成数字,不然列宽设置无效 */
      x: 200,
      /** 设置之后 ,表格头就会被固定 */
      y: document.documentElement.clientHeight - 200,
    },
    style: {
      margin: '0 20px',
    },
  };

  /** 创建可控表单实例--用于新建表 */
  const [form] = Form.useForm();
  /** 模态框属性 */
  const modalProps = getModalConfig({
    visible,
    title: '新建数据表',
    /**
   * 弹框确定按钮回调
   * @param e  点击按钮事件源
   * @param { form-新建表可控表单实例 }
   */
    onOk: (e) => {
      form
        .validateFields() /** 表单校验 */
        .then((values) => {
          /**
           * 与后端协商,只提交页面上有的字段,没有的不传
           */
          const { mainTableCode, maxLevel, type } = values;
          /** 附属表,才有auxTable */
          if (type === "auxTable") {
            values.auxTable = {
              mainTableCode
            };
            delete values.mainTableCode;
          } else if (type === 'tree') {
            values.treeTable = {
              maxLevel
            };
            delete values.maxLevel;
          }
          /** 用户新增数据类型都是业务类型 */
          values.species = "BIS";

          console.log(values);
          /** 新建表数据提交 */
          Http.post('/data/v1/tables/', values).then(() => {
            Msg.success('操作成功');
            queryList();
            /** 关闭弹窗 */
            setVisiable(false);
          });
        })
        .catch((errorInfo) => {
          /** 校验未通过 */
          console.log(errorInfo);
          Msg.error('表单校验未通过');
        });
      // }
    },
    /** 弹框取消按钮回调 */
    onCancel: (e) => {
      setVisiable(false);
      form.resetFields();
    },
  });
  /** 新建表表单属性 */
  const formProps = {
    form,
    treeData,
  };

  /** 左侧菜单树配置 */
  const treeProps = {
    blockNode: true,
    dataSource: treeData,
    /**
    * 点击了左侧菜单树的叶子节点,就进行查询
    */
    onSelect: (selectedKeys, e:{selected, selectedNodes, node, event}) => {
      /**
      * selectedKeys是个数组,第一项就是选中项
      * 用菜单id搜索,页面从第一页开始
      */
      queryList({ moduleId: selectedKeys[0], offset: 0 });
      // console.log(selectedKeys[0]);
    }
  };

  /**
  * 搜索表单实例
  */
  const [searchForm] = Form.useForm();
  /** 搜索条件-表名称 */
  const searchProps = {
    form: searchForm,
    items: {
      type: {
        itemAttr: {
          label: "表类型",
        },
        compAttr: {
          type: 'BasicSelect',
          enum: TableTypeEnum,
          placeholder: "请选择表类型",
        }
      },
      name: {
      /** 表单项属性 */
        itemAttr: {
          label: "表名称",
          rules: [
            { required: false, message: '请输入数据表名称!' },
            { pattern: /^[\u4e00-\u9fa5_a-zA-Z0-9()]+$/, message: '输入字段可以为中文、英文、数字、下划线、括号' },
            { max: 64, message: '最多只能输入64个字符' },
          ],
        },
        /** 表单项包裹组件属性 */
        compAttr: {
          type: 'Input',
          placeholder: '请输入表名称',
        }
      },
      btns: {
        itemAttr: {},
        compAttr: [
          {
            type: 'primary',
            text: '搜索',
            onClick: () => {
              searchForm
                .validateFields() /** 表单校验 */
                .then((values) => {
                  const { type, name } = values;
                  /**
                   * 列表查询,页码从0开始
                   */
                  queryList({ type, name, offset: 0 });
                });
            }
          },
          {
            type: '',
            text: '清空',
            onClick: () => {
              searchForm.resetFields();
            }
          }
        ]
      }
    }

  };

  return (
    <div className="auth-item flex b1px " style={{ height: '100%' }}>
      <aside className="tree-box">
        {/* 含有搜索功能的菜单树 */}
        <MenuTree {...treeProps} />
      </aside>
      <main className="content bl1px">
        {/* 搜索条件框 */}
        <BasicForm {...searchProps} />
        {/* 表头菜单--新建表 标签管理 更多按钮 */}
        <StructHeadMenu openModal={() => setVisiable(true)}/>
        {/* 表结构列表 */}
        <List {...tableProps} />
      </main>
      {/* 新建表弹窗 */}
      <Modal {...modalProps}>
        {/* 新建表表单 给内容组件加个key,保证组件的内容能够重置,如果不加这个key,模态框第二次打开时,关联显示项不是默认项 */}
        <StructForm {...formProps} />
      </Modal>
    </div>
  );
};

const TableStructApp = Connector(TableStruct);

export default TableStructApp;
