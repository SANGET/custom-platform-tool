import React, { useEffect } from "react";

const DataChangeParser = (dataChanged, parseContext) => {
  console.log(dataChanged);
  console.log(parseContext);
  const { pageRuntimeState } = parseContext;
  useEffect(() => {
    console.log('effect');
  }, [pageRuntimeState.data_UUID1]);
  return {};
};

export default DataChangeParser;
