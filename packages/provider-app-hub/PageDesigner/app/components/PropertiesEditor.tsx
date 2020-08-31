import React from 'react';
import Editor, { PropertiesEditorProps } from '@engine/visual-editor/components/PropertiesEditor';

interface PropsEditorProps extends PropertiesEditorProps {
  customConfig?: {}
}

const PropertiesEditor = ({
  ...otherProps
}: PropsEditorProps) => {
  return (
    <div>
      <Editor {...otherProps} />
    </div>
  );
};

export default PropertiesEditor;
