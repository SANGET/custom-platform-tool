import React from 'react';
import Editor from '@engin/visual-editor/components/PropertiesEditor';

const PropertiesEditor = (props) => {
  return (
    <div>
      PropertiesEditor
      <Editor {...props} />
    </div>
  );
};

export default PropertiesEditor;
