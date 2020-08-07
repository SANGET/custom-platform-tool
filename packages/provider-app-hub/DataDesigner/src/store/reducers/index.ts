/*
 * @Author: your name
 * @Date: 2020-08-03 12:24:31
 * @LastEditTime: 2020-08-07 14:21:14
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: \custom-platform-v3-frontend\packages\provider-app-hub\DataManager\src\reducers\index.ts
 */
/** 导入状态值接口定义 */
import { Action, IState } from '@provider-app/data-design/src/store/initState';
/** 动作定义 */
const reducer = (
  state: IState | null | undefined,
  action: Action,
) => {
  if (!state) {
    return null;
  }

  switch (action.type) {
    /** 设置树形数据 */
    case 'setTreeData': {
      console.log({ treeD: action.treeData });
      return {
        ...state,
        treeData: action.treeData
      };
    }
    /** 改变表结构页码 */
    case 'triggerStructPager': {
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
    /** 控制加载动画显示隐藏 */
    case 'triggerLoading': {
      return { ...state, isShowLoading: action.isShowLoading };
    }

    default:
      return state;
  }
};

export default reducer;
