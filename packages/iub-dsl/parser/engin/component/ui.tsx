import React, { Fragment } from "react";
import { Input, Button, Dropdown } from "@infra/ui";
import { UserBehavior, ComponentType } from "@iub-dsl/core";
import * as Comps from '@iub-dsl/core/types/component/components';

/**
 * @description 直接对接UI隔离层, 提供统一标准
 */

type ActionAnalysisResult = {
  [action in UserBehavior]: (any) => unknown;
};

const InputCompParser: React.FC<Comps.Input> = ({ label, ...args }): React.ReactElement => {
  console.log(args);
  return (<Fragment>
    {label} :
    <input
      {...args}
    />
  </Fragment>);
};

const ButtonCompParser: React.FC<Comps.Button> = ({
  text, type, ...args
}) => {
  return (<button>{text}</button>);
};

// 在外部应该有一个结构转换的描述
const SelectorCompParser: React.FC<Comps.Selector> = ({ label, type, dataSource }) => {
  if (!Array.isArray(dataSource)) {
    dataSource = [];
  }
  return (<Fragment>
    {label} :
    <select>
      {dataSource.map((_) => <option key={_.value} value={_.value}>{_.label}</option>)}
    </select>
  </Fragment>);
};

const DefaultComp = (props) => <div>组件获取异常</div>;

const GetUIParser = (compType: string) => {
  switch (compType) {
    case "Input":
      return InputCompParser;
    case "Button":
      return ButtonCompParser;
    case "Selector":
      return SelectorCompParser;
    default:
      return DefaultComp;
  }
};

export default GetUIParser;
