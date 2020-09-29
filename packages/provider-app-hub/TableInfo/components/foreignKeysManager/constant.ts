import {
  SPECIES, BUTTON_TYPE, BUTTON_SIZE, NOTIFICATION_TYPE, API_ERROR_MSG
} from '../../constant';

import { DATATYPE, COLUMNS_KEY } from '../columnsManager/constant';

export {
  SPECIES, BUTTON_TYPE, BUTTON_SIZE, DATATYPE, NOTIFICATION_TYPE, API_ERROR_MSG, COLUMNS_KEY
};

export enum FOREIGNKEYS_KEY {
  'INDEX' = 'index',
  'FIELDNAME' = 'fieldName',
  'FIELDCODE' = 'fieldCode',
  'REFTABLECODE' = 'refTableCode',
  'REGTABLEID' = 'refTableId',
  'REFTABLEID' = 'refTableId',
  'REFFIELDCODE' = 'refFieldCode',
  'REFFIELDTYPE' = 'refFieldType',
  'REFFIELDSIZE' = 'refFieldSize',
  'REFFIELDNAME' = 'refFieldName',
  'REFDISPLAYCODE' = 'refDisplayFieldCode',
  'ID' = 'id',
  'SPECIES' = 'species',
  'EDITABLE' = 'editable',
  'DELETESTRATEGY' = 'deleteStrategy',
  'UPDATESTRATEGY' = 'updateStrategy',
  'CREATEDCUSTOMED' = 'createdCustomed',
}
