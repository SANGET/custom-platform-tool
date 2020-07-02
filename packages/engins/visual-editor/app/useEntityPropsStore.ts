import { useState } from "react";
import { EntityPropertiesStore } from "../types";

export type SaveEntityPropsStore = (id: string, formState: any) => void

/**
 * React hook for store of component's props
 */
export const useEntityPropsStore = (defaultState = {}): [
  EntityPropertiesStore, SaveEntityPropsStore
] => {
  const [componentPropStore, setComponentPropStore] = useState(defaultState);

  const saveComponentPropStore: SaveEntityPropsStore = (id: string, formState) => {
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
