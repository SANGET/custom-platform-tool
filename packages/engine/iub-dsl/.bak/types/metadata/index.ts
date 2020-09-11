// export * from './metadata-mapping';
import { DataSourceRelation } from "./metadata-relation";
import { GeneralTableMapping } from "./metadata-mapping";

export * from './metadata-mapping';
export * from './metadata-relation';

export interface MetadataMappingCollection {
  dataSource: {
    [tableId: string]: GeneralTableMapping;
  };
  dataSourceRelation?: {
    [tableId: string]: {
      [dataSourceRelationId: string]: DataSourceRelation
    }
  };
}

export default MetadataMappingCollection;
