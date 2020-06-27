export const SELECT_ENTITY = 'SELECT_ENTITY';
export const SelectEntity = (entity) => {
  return {
    type: SELECT_ENTITY,
    entity
  };
};

export interface Dispatcher {
  SelectEntity: typeof SelectEntity
}
