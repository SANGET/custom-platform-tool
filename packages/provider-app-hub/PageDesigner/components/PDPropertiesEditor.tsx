import React from 'react';
import Editor, { PropertiesEditorProps } from '@engine/visual-editor/components/PropertiesEditor';
import { PropItemRenderer } from './PDPropItemRenderer';

interface PropsEditorProps extends Omit<PropertiesEditorProps, 'propItemRenderer'> {
  interDatasources: PD.Datasources
  customConfig?: any
}

/**
 * Page design prop editor
 */
const PDPropertiesEditor = ({
  ChangeMetadata,
  interDatasources,
  pageMetadata,
  ...otherProps
}: PropsEditorProps) => {
  return (
    <div>
      <Editor
        {...otherProps}
        pageMetadata={pageMetadata}
        ChangeMetadata={ChangeMetadata}
        propItemRenderer={(props) => {
          return (
            <PropItemRenderer
              {...props}
              pageMetadata={pageMetadata}
              ChangeMetadata={ChangeMetadata}
              interDatasources={interDatasources}
            />
          );
        }}
      />
    </div>
  );
};

export default PDPropertiesEditor;
