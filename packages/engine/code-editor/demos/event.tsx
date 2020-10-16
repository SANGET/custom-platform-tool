import React, { ReactElement } from 'react';
import CodeEditor from '@engine/code-editor';

const Search: React.FC = (): ReactElement => {
  const handleChange = (instance: any, changeObj: any) => {
    console.dir(changeObj);
  };
  return <CodeEditor
    value="function add(a, b){ return a+b };"
    mode="javascript"
    onChange={handleChange}
  />;
};
export default Search;
