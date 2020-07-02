import { useState, useEffect } from "react";

/**
 * 用于管理点击后的更新状态
 */
const useUpdateState = (defaultState = false): [
  boolean, () => void
] => {
  const [updateState, setUpdateState] = useState(defaultState);

  let timmer;

  const toUpdate = () => {
    clearTimeout(timmer);
    setUpdateState(true);

    timmer = setTimeout(() => {
      setUpdateState(false);
    }, 1000);
  };

  useEffect(() => {
    return () => {
      clearTimeout(timmer);
    };
  }, [updateState]);

  return [
    updateState, toUpdate
  ];
};

export default useUpdateState;
