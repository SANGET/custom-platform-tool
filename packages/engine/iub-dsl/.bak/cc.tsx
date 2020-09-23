import React, {
  useContext, useState, useMemo, useEffect
} from 'react';
import { AllComponentType } from "@iub-dsl/types";
import { GetUI, HyFromItem } from "./getUI";
import TableFactory from './UI-factory/data-display/table';
import TableText from './UI-factory/data-display/table2';

const C = React.createContext<any>({});

const FieldParserMarkTip = ({ children }) => {
  return React.memo(({}) => {
    const { markTip } = useContext(C);
    const MarkTip = GetUI('HyToolTip');

    console.log(1);

    return (
      <MarkTip tipContent={markTip} >
        {children}
      </MarkTip>
    );
  });
};

const FromItemWrap = ({ children }) => {
  return React.memo((props) => {
    const { children: dynmaicChildren } = props;
    const { label } = useContext(C);
    return (
      <HyFromItem
        label={label}
      >{children}</HyFromItem>
    );
  });
};

const InputFactory = () => {
  return React.memo(({ ...props }) => {
    const Comp = GetUI(AllComponentType.Input);
    const { unit } = useContext(C);
    console.log(2);

    return (
      <Comp
        suffix={unit}
        {...props}
      />
    );
  });
};

interface BaseConf<T = AllComponentType> {
  label: string; // *
  value: string; // *
  unit: string; // *

  /** 提示信息 */
  placeholder: string; // 显示在文本框背部
  /** 文字提示 */
  markTip: string; // 悬浮的文字提示

  /** 数据源相关 */
  compCode: string; // 控件编码
  compId: string;
  compType: T;
  schemasQuote: string;
  // dataType \ dataLength
}

/** 解析后就长这样, 解析后需要改变得
 * 组合、解析、 动态
*/
const InputParser = ({ conf }) => {
  const [value, setValue] = useState(conf);
  // useState({
  //   // unit: '未'
  //   markTip: '项目迷'
  // });

  useEffect(() => {
    setTimeout(() => {
      value.markTip = '⬇️';
      console.log(value);

      setValue({ ...value });
    }, 1000);
  }, []);

  const B = InputFactory();
  const CCP = FieldParserMarkTip({
    children: <B a={1}/>
  });
  const A = FromItemWrap({
    children: <CCP v={2}/>
  });
  console.log(B);
  console.log(CCP);
  console.log(A);
  console.log('------------');
  console.log(C);

  console.log(useContext(C));

  console.log('ctx');

  return (
    <C.Provider value={conf}>
      <A/>
      {/* <CC.Provider value={value}> */}
      {/* {FromItemWrap({
        children: FieldParserMarkTip({
          children: InputFactory()
        })
      })} */}
      {/* </CC.Provider> */}
    </C.Provider>
  );
};

export const componentParser = () => {
  /**
   * 1. 分析结构
   * 2. 根据字段组件处理和获取
   * 3. 处理不认识的字段, 外部处理
   * 4. 拼装组件
   * 5. 容器组件生成?
   */
  const conf: BaseConf<AllComponentType.Input> = {
    label: '位置名称',
    value: '',
    unit: '位',
    placeholder: '请输入位置名称',
    markTip: '详细真实的位置名称',
    compCode: 'compId1',
    compId: 'compId1',
    compType: AllComponentType.Input,
    schemasQuote: '$(schemas).dId1'
  };
  const TableComp = TableFactory();
  // GetUI(AllComponentType.Input);
  return (
    <>
      {TableComp}
      {/* <InputParser conf={conf} /> */}
      {/* <TableText/> */}
    </>
  );
};
const fn = () => {
  const context = {};
  return (
    <C.Provider value={{}}>
      <div>
        <div>
          <span></span>
        </div>
        <span></span>
      </div>
    </C.Provider>
  );
};
