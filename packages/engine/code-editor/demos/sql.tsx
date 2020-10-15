import React, { ReactElement } from 'react';
import CodeEditor from '@engine/code-editor';

const Sql: React.FC = (): ReactElement => {
  return <CodeEditor
    value= ""
    mode="sql"
    hintOptions={{
      tables: { table1: ['name', 'score', 'birthDate'], table2: ['bcd'], table3: ['edd'] },
      completeSingle: false,
    }}
  />;
};
export default Sql;
