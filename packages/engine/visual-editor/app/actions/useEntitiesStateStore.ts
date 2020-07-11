import { useState } from "react";
import { EntityPropertiesStore } from "../../types";

export type SaveEntitiesStateStore = (id: string, formState: any) => void

/**
 * React hook for store of component's props
 */
export const useEntitiesStateStore = (defaultState = {}): [
  EntityPropertiesStore, SaveEntitiesStateStore
] => {
  const [entitiesStateStore, setComponentPropStore] = useState(defaultState);

  const saveComponentPropStore: SaveEntitiesStateStore = (id: string, formState) => {
    setComponentPropStore({
      ...entitiesStateStore,
      [id]: {
        ...formState
      }
    });
  };

  return [
    entitiesStateStore, saveComponentPropStore
  ];
};
