import React, { ReactElement } from 'react';
import CodeEditor from '@engine/code-editor';
import { Button } from 'antd';

const FullScreen: React.FC = (): ReactElement => {
  let refEditor: any;
  const handlefullScreen = (): void => {
    refEditor.setOption("fullScreen" as any, !refEditor.getOption("fullScreen" as any));
  };
  const getEditor = (editor: any) => {
    refEditor = editor;
  };
  return (
    <>
      <CodeEditor
        value="function add(a, b){ return a+b };"
        mode="javascript"
        fullscreen={true}
        getEditor={getEditor}
        extraKeys={{
          F1(cm) {
            cm.setOption("fullScreen" as any, !cm.getOption("fullScreen" as any));
          },
          Esc(cm) {
            if (cm.getOption("fullScreen" as any)) cm.setOption("fullScreen" as any, false);
          }
        }}
      />
      <Button onClick={handlefullScreen}>全屏</Button>
    </>
  );
};
export default FullScreen;
