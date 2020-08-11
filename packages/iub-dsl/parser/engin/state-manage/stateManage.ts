import React, { useState, useEffect, useContext } from 'react';

export const useIUBStore = (
  storeInit,
  enhancerConfig?,
) => {
  const [state, set] = useState({});

  useEffect(() => {
    storeInit().then((initState) => {
      setState(initState);
    });
  }, []);

  function getState() { // 增强
    return state;
  }

  function setState(newState) { // 增强
    set(newState);
  }
  return {
    setState,
    getState,
    state
  };
};
