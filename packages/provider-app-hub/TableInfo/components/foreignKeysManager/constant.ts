import {
  SPECIES, BUTTON_TYPE, BUTTON_SIZE, NOTIFICATION_TYPE, API_ERROR_MSG
} from '../../constant';

import { DATATYPE } from '../columnsManager/constant';

export {
  SPECIES, BUTTON_TYPE, BUTTON_SIZE, DATATYPE, NOTIFICATION_TYPE, API_ERROR_MSG
};

export enum FOREIGNKEYS_KEY {
  'INDEX' = 'index',
  'FIELDNAME' = 'fieldName',
  'FIELDCODE' = 'fieldCode',
  'REFTABLECODE' = 'refTableCode',
  'REFTABLEID' = 'refTableId',
  'REFFIELDCODE' = 'refFieldCode',
  'REFDISPLAYCODE' = 'refDisplayFieldCode',
  'ID' = 'id',
  'SPECIES' = 'species',
  'EDITABLE' = 'editable',
  'DELETESTRATEGY' = 'deleteStrategy',
  'UPDATESTRATEGY' = 'updateStrategy',
  'CREATEDCUSTOMED' = 'createdCustomed',
}
