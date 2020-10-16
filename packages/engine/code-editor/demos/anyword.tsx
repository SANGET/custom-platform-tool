import React, { ReactElement } from 'react';
import CodeEditor from '@engine/code-editor';

const Home: React.FC = (): ReactElement => {
  return <CodeEditor
    value= ""
    mode="text/x-textile"
    hintOptions={{
      completeSingle: false,
      list: ['sx', "xxxx"]
    }}
  />;
};
export default Home;
