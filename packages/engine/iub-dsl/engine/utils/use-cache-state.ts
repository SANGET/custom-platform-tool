import {
  useState, Dispatch, SetStateAction, useCallback
} from 'react';
/** useState增强 */
export const useCacheState: <S>(
  init: S | (() => S)
) => [S, Dispatch<SetStateAction<S>>] = (initialValueOrFn) => {
  const [state, set] = useState(initialValueOrFn);
  const setState = useCallback(
    (patch) => {
      const isPatchFunc = patch instanceof Function;
      set((prevState) => Object.assign({}, prevState, isPatchFunc ? patch(prevState) : patch));
    },
    [set],
  );
  return [state, setState];
};
