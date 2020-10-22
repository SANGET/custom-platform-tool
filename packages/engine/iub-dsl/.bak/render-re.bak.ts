// let compProps = commonCompPropsResolved(propsMap);
// switch (compTag) {
//   case AllUI.BaseInput:
//     const p = commonCompPropsResolved(propsMap);
//     if (Math.random() > 0.3) {
//       const [state, setstate] = useState(p);
//       useEffect(() => {
//         setTimeout(() => {
//           setstate({ ...p, placeholder: '异步内容!!~~~~!!' });
//         }, 3000);
//       }, []);
//       compProps = state;
//     } else {
//       compProps = p;
//     }
//     console.log(compProps);
//     break;
//   case AllUI.FormItem:
//     break;
//   case AllUI.FromWrap:
//     break;
//   case AllUI.Tootip:
//     break;
//   case AllUI.Error:
//   default:
//     break;
// }

const context = {
  asyncHandle: {}
};
const props = [{ key: "unit", val: "单位" }, { key: "placeholder", val: "请输入内容?" }];

fnn(commonPropsInfoResolved, context)(props);
const fnn = (originHandler, context, options?) => {
/** 拦截的前置处理 */

  /** 调用时候的函数 */
  return (...params) => {
  /** 仅处理某个参数 */

    // 同步/异步??
    // 中间件??

    /** 处理完的参数 */
    const newParams = params;

    /** 真实处理 */
    const handelerRes = originHandler(...newParams);

    return handelerRes;
  };
};
