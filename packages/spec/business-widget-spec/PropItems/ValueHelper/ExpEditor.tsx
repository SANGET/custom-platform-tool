import React, { useRef, useState } from 'react';
import ExpressEditor from '@engine/code-editor';
import { Button } from 'antd';

export const ExpEditor = ({
  defaultValue,
  onSubmit
}) => {
  const [editingVal, setEditingVal] = useState('');
  const editorRef = useRef();
  return (
    <div>
      <ExpressEditor
        value={defaultValue}
        ref={editorRef.current}
        // theme="3024-day"
        onChange={(instance) => {
          const value = instance.getValue();
          setEditingVal(value);
        }}
      />
      <div className="px-4 py-2">
        <Button
          onClick={(e) => {
            onSubmit?.(editingVal);
          }}
        >
          确定
        </Button>
      </div>
    </div>
  );
};
