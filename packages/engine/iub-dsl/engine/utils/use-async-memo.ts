import { DependencyList, useEffect, useState } from 'react';

export function useAsyncMemo<T = any>(
  factory: () => Promise<T> | undefined | null,
  deps: DependencyList,
  initial?: T
): T | undefined {
  const [val, setVal] = useState<T | undefined>(initial);
  useEffect(() => {
    let cancel = false;
    const promise = factory();
    const destroyFn = () => { cancel = true; };
    if (promise === undefined || promise === null) return destroyFn;
    promise.then((resolveVal) => {
      if (!cancel) {
        setVal(resolveVal);
      }
    });
    return destroyFn;
  }, deps);
  return val;
}
