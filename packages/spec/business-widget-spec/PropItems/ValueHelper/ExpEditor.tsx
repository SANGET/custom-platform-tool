import React, { useRef, useState, Suspense } from 'react';
import { Button } from 'antd';

const ExpressEditor = React.lazy(() => import('@engine/code-editor'));

export const ExpEditor = ({
  defaultValue,
  onSubmit
}) => {
  const [editingVal, setEditingVal] = useState('');
  const editorRef = useRef();
  return (
    <div>
      <Suspense fallback={<div>Loading...</div>}>
        <ExpressEditor
          value={defaultValue}
          ref={editorRef.current}
          // theme="3024-day"
          onChange={(instance) => {
            const value = instance.getValue();
            setEditingVal(value);
          }}
        />
      </Suspense>
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
