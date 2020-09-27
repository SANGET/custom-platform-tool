import React, { useState } from 'react';
import { Tabs, Row } from 'antd';
import { ColumnsManager } from './columnsManager';
import { ReferencesManager } from './referencesManager';
import { ForeignKeysManager } from './foreignKeysManager';
import { IReference, ITableColumn } from '../interface';

const { TabPane } = Tabs;
interface IProps {
  tableId: string
  columns: ITableColumn[]
  columnsValid: boolean
  references: IReference[]
  referencesValid: boolean
  foreignKeys: any[]
  foreignKeysValid: boolean
  dispatchInfo: (param:{type: string, name: any})=>void
}
/**
 * 管理tab组件
 * 包括 字段管理，引用管理，外键管理
 */
export const ManagerTabs: React.FC<IProps> = React.memo((props: IProps) => {
  const {
    tableId, columns, dispatchInfo, references, foreignKeys,
  } = props;
  const [activeKey, setActiveKey] = useState<string>('references');
  const map = {
    columns: 'columnsValid',
    references: 'referencesValid',
    foreignKeys: 'foreignKeysValid',
  };
  const handelChangeTab = (activeKeyTmpl) => {
    const valid = props?.[map?.[activeKey]];
    if (!valid) return;
    setActiveKey(activeKeyTmpl);
  };
  return (
    <Row className="margin-blr10 manager-tabs">
      <Tabs onTabClick={handelChangeTab} type="card" style={{ width: "100%" }} activeKey = {activeKey}>
        <TabPane tab="表字段" key="columns">
          <ColumnsManager
            tableId = { tableId }
            columns = { columns }
            dispatchInfo = { dispatchInfo }
          />
        </TabPane>
        <TabPane tab="引用表" key="references">
          <ReferencesManager
            columns = { columns }
            references = { references }
            dispatchInfo = { dispatchInfo }
          />
        </TabPane>
        <TabPane tab="外键设置" key="foreignKeys">
          <ForeignKeysManager
            columns = { columns }
            foreignKeys = { foreignKeys }
            dispatchInfo = { dispatchInfo }
          />
        </TabPane>
      </Tabs>
    </Row>
  );
});
