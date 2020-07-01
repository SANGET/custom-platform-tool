import { useState } from "react";

interface ComponentPropStore {
  [id: string]: {}
}

type SaveComponentPropStore = (id: string, formState: any) => void

/**
 * React hook for store of component's props
 */
export const useComponentPropStore = (defaultState = {}): [
  ComponentPropStore, SaveComponentPropStore
] => {
  const [componentPropStore, setComponentPropStore] = useState(defaultState);

  const saveComponentPropStore: SaveComponentPropStore = (id: string, formState) => {
    setComponentPropStore({
      ...componentPropStore,
      [id]: {
        ...formState
      }
    });
  };

  return [
    componentPropStore, saveComponentPropStore
  ];
};
