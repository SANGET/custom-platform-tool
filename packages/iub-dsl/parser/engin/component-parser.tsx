import React from "react";
import { Input } from "@infra/ui-interface";
import { ComponentElement } from "@iub-dsl/core/types/component/collection";
import { ParserBindActions } from "../types/parser-interface";
import flowExecutor from "./flow";

export interface ComWrapperProps {
  onClick: () => void;
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
  bindActions: ParserBindActions
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
      onClick={(e) => {
        // TODO: 做 actionLoader
        let onClickActionFlow;
        switch (actions?.onClick?.type) {
          case 'actionRef':
            onClickActionFlow = bindActions.bindAction(actions.onClick.actionID);
            // console.log(onClickActionFlow);
            flowExecutor(onClickActionFlow);
            break;
        }
      }}
    >
      {resCom}
    </ComWrapper>
  );
};

// const ComParser = ({ config, context }) => {
//   const { type } = config;
//   switch (type) {
//     case "Input":
//       const { Input } = await import("@infra/ui-interface");
//       return <Input />;
//     case "Button":
//       const { Button } = await import("@infra/ui-interface");
//       return (
//         <Button
//           onClick={(e) => {
//             config.actions.onClick(context);
//           }}
//         />
//       );
//     default:
//       break;
//   }
// };

// const App = () => {
//   const runtimeState = {
//     apiFetch: (params) => {
//       const reqApbData = toApb(params);
//       const resData = fetch(reqApbData);
//     },
//   };
//   return (
//     <ComParser
//       config={{
//         type: "Button",
//         text: "录入",
//       }}
//       context={runtimeState}
//     />
//   );
// };

export default componentParser;
