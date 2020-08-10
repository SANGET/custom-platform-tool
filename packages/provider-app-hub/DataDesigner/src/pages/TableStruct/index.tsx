/*
 * @Author: wangph
 * @Date: 2020-07-10 12:00:29
 * @Last Modified by:   wangph
 * @Last Modified time: 2020-07-10 12:00:29
 */

import React, { FC, useState, useEffect } from 'react';
import {
  Menu, Dropdown, Button, Input, Modal, Form
} from 'antd';
/** icon图标--向下的箭头 */
import { DownOutlined } from '@ant-design/icons';

/** 网络请求工具 */
import Http from '@infra/utils/http';
/** 状态管理方法 */
import { useMappedState, useDispatch } from 'redux-react-hook';
/** 自定义基础组件 */
/** 树形组件 */
import BasicTree from '@provider-app/data-design/src/components/BasicTree';
/** 选择框组件 */
import { BasicSelect } from '@provider-app/data-design/src/components/BasicSelect';
/** 表类型枚举--表格列代码转文字时也要用 */
import { TableTypeEnum } from '@provider-app/data-design/src/tools/constant';

/** 树操作方法 */
import {
  treeQuery, listToTree
} from '@provider-app/data-design/src/tools/tree';

/** GMT时间格式化 */
import {
  formatGMT
} from '@provider-app/data-design/src/tools/format';

/** 表单业务组件 */
import StructForm from './StructForm';

/** 表头菜单组件 */
import TableHeadMenu from './TableHeadMenu';

/** 表格业务组件 */
import List from './List';

/** 当前功能页样式 */
import './tableStruct.less';

/** 搜索输入框 */
const { Search } = Input;

/** 共享状态值--表结构分页和树形源数据 */
const mapState = (state) => ({
  treeData: state.treeData
});
/** 给你一些使用react hook的理由  */
/** 理由一： hook使你无需更改页面结构,也能在不同的组件间复用状态,为了在组件间复用状态,providers,consumers,render Props、高阶组件这类方案需要更改页面结构
 *         通过抽象层组成的组件解决将可复用状态附加到组件路径的做法会形成嵌套地狱,
 */
/** 理由二： 复杂组件更易理解  状态逻辑和副作用充斥在组件中,使简单组件变得复杂,在hook中可以用内置暴露的reduces管理这些状态,此外,相互关联且需要对照修改的代码被拆分到不同的生命周期中 */
/**         hook将相互关联的拆分成更小的函数，而并非强制按照生命周期划分 */
/**  理由三 函数式组件比class组件更容易理解, 在函数组件中,很好理解props，state 和自顶向下的数据流，但在class组件中却一筹莫展，class组件中this的工作方式也不好理解 */
/**  理由四 从概念上来讲React组件更像函数,而hook拥抱了函数,class组件不能很好的压缩,热重载不稳定,class组件会使component folding优化措施无效 */
const TableStructContainer: FC = () => {
  /** 在网络请求工具中,要用dispatch更改共享状态 */
  const dispatch = useDispatch();
  /** structPager显示列表序号的时候要用 treeData 左侧菜单树要用 */
  const { treeData } = useMappedState(mapState);

  /**
   *  useState和useReducer该如何选择
   * 如果 state 的类型为 Number, String, Boolean 建议使用 useState，如果 state 的类型 为 Object 或 Array，建议使用 useReducer
   * 如果 state 变化非常多，也是建议使用 useReducer，集中管理 state 变化，便于维护
   * 如果 state 关联变化，建议使用 useReducer
   * 业务逻辑如果很复杂，也建议使用 useReducer
   * 如果 state 只想用在 组件内部，建议使用 useState，如果想维护全局 state 建议使用 useReducer
   *    */

  /** 设置模块框的显示隐藏 */
  const [visible, setVisiable] = useState<boolean>(false);

  const [tableData, setTableData] = useState([]);

  useEffect(() => {
    const getPageData = async () => {
      /** 请求菜单树,表结构的表类型列依赖菜单树数据 */
      const menuTreeRes = await Http.get('http://localhost:60001/mock/menu.json', {});
      const tData = listToTree(menuTreeRes.data.result);
      dispatch({ type: 'setTreeData', treeData: tData });

      /** 请求表结构列表数据 */
      const tableRes = await Http.get('http://localhost:60001/mock/structList.json', {});

      /** 表格数据格式转换-注意setTableData之后不能立刻获取最新值 */
      setTableData(tableRes.data.result.data.map((col) => {
        /** 根据节点的key查找节点完整信息 */
        /** 返回节点的名称 */
        col.module_id = treeQuery(tData, col.module_id).title;
        // console.log(col.module_id);
        /** 将表类型代码转换为文字 */
        const showText = TableTypeEnum.find((item) => item.value === col.type);
        col.type = showText ? showText.text : '';
        /** gmt时间格式转yyyy-MM-dd hh:mm:ss */
        col.gmt_create = formatGMT(col.gmt_create);
        col.gmt_modified = formatGMT(col.gmt_modified);
        /** antd table每行记录必需有key字段 */
        col.key = col.id;
        return col;
      }));
    };

    getPageData();

    // window.onresize = function () {
    //   console.log('log');
    // };
  }, []);

  /** 表格属性 */
  const tableProps = {
    treeData,
    tableData,
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
  const modalProps = {
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
          // console.log(values);
          /** 新建表数据提交 */
          Http.post('http://{ip}:{port}/paas/{lesseeCode}/{applicationCode}/data/v1/tables/', {
            data: values
          }).then(() => {
            /** 关闭弹窗 */
            setVisiable(false);
          });
        })
        .catch((errorInfo) => {
          /** 校验未通过 */
          console.log(errorInfo);
        });
      // }
    },
    /** 弹框取消按钮回调 */
    onCancel: (e) => {
      setVisiable(false);
    },
    okText: '确定',
    cancelText: '取消',
    width: 800,
  };
  /** 新建表表单属性 */
  const formProps = {
    form,
    treeData,
    initialValues: { name: '回显测试' },
  };

  const basicTreeProps = {
    draggable: true,
    blockNode: true,
  };
  /** 搜索条件-表类型 */
  const basicSelectProps = {
    enum: TableTypeEnum,
    style: { width: 224 },
    placeholder: "请选择表类型",
    onChange: (value) => {
      console.log(value);
    }
  };
  /** 搜索条件-表名称 */
  const searchProps = {
    style: { width: 224, margin: '16px' },
    placeholder: '请输入表名称',
    onSearch: (value) => {
      console.log(value);
    },
    enterButton: true,
  };

  return (
    <div className="auth-item flex b1px " style={{ height: '100%' }}>
      <aside className="tree-box">
        {/* 按照单一职责拆分组件,比直接组合更灵活 */}
        {/* <Input {...inputProps} /> */}
        {/* <Tree treeData={treeData} /> */}
        <BasicTree {...basicTreeProps} dataSource={treeData} />
      </aside>
      <main className="content bl1px">
        {/* 搜索条件框 */}
        <div className="flex v-center ml20">
          <BasicSelect {...basicSelectProps} />
          <Search {...searchProps} />
        </div>
        {/* 表头菜单--新建表 标签管理 更多按钮 */}
        <TableHeadMenu openModal={() => setVisiable(true)}/>
        {/* 表结构列表 */}
        <List {...tableProps} />
      </main>
      {/* 新建表弹窗 */}
      <Modal {...modalProps}>
        {/* 新建表表单 */}
        <StructForm {...formProps} />
      </Modal>
    </div>
  );
};

export default TableStructContainer;
