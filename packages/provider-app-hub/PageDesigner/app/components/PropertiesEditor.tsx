import React from 'react';
import Editor, { PropertiesEditorProps } from '@engine/visual-editor/components/PropertiesEditor';
import { PropItemRenderer } from '../../ComponentsSpec/Renderer/PropItemRenderer';

interface PropsEditorProps extends PropertiesEditorProps {
  customConfig?: any
}

const PropertiesEditor = ({
  ...otherProps
}: PropsEditorProps) => {
  return (
    <div>
      <Editor
        {...otherProps}
        propItemRenderer={(props) => {
          return <PropItemRenderer {...props} />;
        }}
      />
    </div>
  );
};

export default PropertiesEditor;
