/*
 * @Author: your name
 * @Date: 2020-08-03 12:24:31
 * @LastEditTime: 2020-08-26 14:31:19
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: \custom-platform-v3-frontend\packages\provider-app-hub\DataManager\src\reducers\index.ts
 */
/** 动作定义 */
const reducer = (
  state,
  action,
) => {
  if (!state) {
    return null;
  }

  switch (action.type) {
    /** 设置树形数据 */
    case 'setTreeData': {
      // console.log({ treeData: action.treeData });
      return {
        ...state,
        treeData: action.treeData
      };
    }

    /** 设置表结构列表枚举 */
    case 'setStructTableEnum': {
      // console.log(action.structTableEnum);
      return {
        ...state,
        structTableEnum: action.structTableEnum
      };
    }
    /** 设置表结构列表数据 */
    case 'setStructRowData': {
      // console.log(action.structRowData));
      return {
        ...state,
        structRowData: action.structRowData
      };
    }
    /** 设置表结构-编辑--表字段列表 是否过滤掉类型为系统的行记录 */
    case 'setSysFieldCtrl': {
      // console.log(action.sysFieldCtrl);
      return {
        ...state,
        sysFieldCtrl: action.sysFieldCtrl
      };
    }
    /** 改变表结构页码 */
    case 'setStructPager': {
      // console.log(action.structPager);
      const { page, pageSize } = action.structPager;
      return {
        ...state,
        strcutPager: {
          page,
          pageSize
        }
      };
    }
    /** 设置加载动画显示隐藏 */
    case 'setLoading': {
      return { ...state, isShowLoading: action.isShowLoading };
    }

    default:
      return state;
  }
};

export default reducer;
