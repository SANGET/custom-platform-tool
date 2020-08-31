import React, { useEffect } from "react";

const DataChangeParser = (dataChanged, parseContext) => {
  console.log(dataChanged);
  console.log(parseContext);
  const { pageRuntimeState } = parseContext;
  // TODO: 1 如何获取外部状态? context ? 如何记录状态 .. ? 全部运行函数包装一层 ?
  // 如何 确定并写入状态
  useEffect(() => {
    console.log('effect');
  }, [pageRuntimeState.data_UUID1]);
  return {};
};

export default DataChangeParser;
