import React from "react";
import { Input } from "@infra/ui-interface";
import { ComponentElement } from "@iub-dsl/core/types/component/collection";

// import {
//   Input
// } from "@infra/ui-interface";

/**
 * 解析 DSL 描述的 component
 */
const componentParser = (componentConfig: ComponentElement) => {
  if (!componentConfig) {
    return (
      <div>组件配置异常</div>
    );
  }
  const { type } = componentConfig.component;
  switch (type) {
    case "Input":
      return (
        <Input
          onChange={(e) => {
            console.log(e);
          }}
        />
      );
    default:
      break;
  }
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
