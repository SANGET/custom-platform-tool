import React, { ReactElement } from 'react';
import CodeEditor from '@engine/code-editor';

const Search: React.FC = (): ReactElement => {
  return <CodeEditor
    value= "function add(a, b){ return a+b };"
    mode="javascript"
    search={true}
    extraKeys={{ "Alt-F": "findPersistent" }}
  />;
};
export default Search;
