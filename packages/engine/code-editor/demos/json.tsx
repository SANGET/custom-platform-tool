import React, { ReactElement } from 'react';
import CodeEditor from '@engine/code-editor';

window.jsonlint = require('jsonlint-mod');

const Json: React.FC = (): ReactElement => {
  return <CodeEditor
    value= ""
    mode="application/json"
    gutters = {["CodeMirror-lint-markers", "CodeMirror-linenumbers", "CodeMirror-foldgutter"]}
    theme="base16-light"
    cusResourceList={
      {
        mode: "application/json",
        dependentLint: () => import('codemirror/addon/lint/json-lint.js')
      }
    }
  />;
};
export default Json;
