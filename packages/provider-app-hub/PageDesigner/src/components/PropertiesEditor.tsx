import React from 'react';
import Editor, { PropertiesEditorProps } from '@engin/visual-editor/components/PropertiesEditor';

interface PropsEditorProps extends PropertiesEditorProps {
  customConfig?: {}
}

const PropertiesEditor = ({
  ...otherProps
}: PropsEditorProps) => {
  return (
    <div>
      PropertiesEditor
      <Editor {...otherProps} />
    </div>
  );
};

export default PropertiesEditor;
