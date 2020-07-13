import { useState } from "react";
import { EditorComponentEntity } from "../../types";

type Entity = EditorComponentEntity

interface UseSelectEntityState {
  selectedList: {
    [id: string]: Entity
  },
  activeID: string,
  activeEntity: Entity
}

type SelectEntity = (id: string, entity: Entity) => void

/**
 * React hook for select entity
 */
export const useSelectEntity = (initState = {
  selectedList: {},
  activeID: '',
  activeEntity: {}
}): [UseSelectEntityState, SelectEntity] => {
  const [selectedEntities, setSelectedEntity] = useState<UseSelectEntityState>(initState);

  const selectEntity = (id: string, entity: Entity) => {
    setSelectedEntity({
      selectedList: {
        [id]: entity
      },
      activeID: id,
      activeEntity: entity
    });
  };

  return [
    selectedEntities, selectEntity
  ];
};
