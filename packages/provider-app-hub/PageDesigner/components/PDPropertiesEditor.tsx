import React from 'react';
import Editor, { PropertiesEditorProps } from '@engine/visual-editor/components/PropertiesEditor';
import { PropItemRenderer } from './PDPropItemRenderer';

interface PropsEditorProps extends Omit<PropertiesEditorProps, 'propItemRenderer'> {
  interDatasources
  customConfig?: any
}

/**
 * Page design prop editor
 */
const PDPropertiesEditor = ({
  interDatasources,
  ...otherProps
}: PropsEditorProps) => {
  return (
    <div>
      <Editor
        {...otherProps}
        propItemRenderer={(props) => {
          return <PropItemRenderer {...props} interDatasources={interDatasources} />;
        }}
      />
    </div>
  );
};

export default PDPropertiesEditor;
