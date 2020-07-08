import React from "react";
import { Input } from "@infra/ui";
import { ComponentElement } from "@iub-dsl/core/types/component/collection";
import { ParserContextGroup } from "../types";
import flowExecutor from "./flow";

export interface ComWrapperProps {
  onClick: (event?) => void;
  children: any;
}

const ComWrapper = ({
  children,
  onClick
}: ComWrapperProps) => {
  return (
    <div
      onClick={(e) => {
        onClick(e);
      }}
    >
      {children}
    </div>
  );
};

/**
 * 解析 DSL 描述的 component
 */
const componentParser = (
  componentConfig: ComponentElement,
  parserContext: ParserContextGroup
) => {
  if (!componentConfig) {
    return (
      <div>组件配置异常</div>
    );
  }
  const { component, actions } = componentConfig;
  const { type } = component;
  let resCom;
  switch (type) {
    case "Input":
      resCom = (
        <Input
          onChange={(e) => {
            console.log(e);
          }}
        />
      );
      break;
    default:
      break;
  }
  return (
    <ComWrapper
      onClick={() => {
        // TODO: actionLoader
        let onClickActionFlow;
        switch (actions?.onClick?.type) {
          case 'actionRef':
            onClickActionFlow = parserContext.bindAction(actions.onClick.actionID);
            // console.log(onClickActionFlow);
            flowExecutor(onClickActionFlow, parserContext);
            break;
        }
      }}
    >
      {resCom}
    </ComWrapper>
  );
};

export default componentParser;
