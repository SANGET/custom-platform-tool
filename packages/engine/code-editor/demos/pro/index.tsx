import React, { ReactElement, useState, useRef } from 'react';
import CodeEditor from '@engine/code-editor';
import createSandbox from '@engine/js-sandbox';
import Frame, { FrameContextConsumer } from 'react-frame-component';
import { Button, Modal } from 'antd';
import './components';
import { Editor } from 'codemirror';
import FuncTree from './functree';
import Variable from './variable';
import { ITreeNodeInfo } from './interface';
import { getFuncParamNames, getFuncBody } from './util';
import styles from './style.less';

let editor: any;
const Pro: React.FC = (): ReactElement => {
  const [currentFuncParams, setCurrentFuncParams] = useState<string[]>([]);
  const [run, setRun] = useState<boolean>(false);
  const [result, setResult] = useState<string>("");
  const variableRef = useRef(null);
  const handleSelectTreeNode = (info: ITreeNodeInfo) => {
    const { name } = info.node;
    if (name && editor) {
      const cur = editor.getCursor();
      editor.replaceRange(name, cur, cur, '+insert');
      editor.setCursor({ line: cur.line, ch: cur.ch + 1 });
    }
  };

  const handleCodeEditorChange = (instance: Editor, changeObj: object) => {
    const params = getFuncParamNames(instance.getValue());
    if (params.length > 0 || (params.length === 0 && currentFuncParams.length === 1)) setCurrentFuncParams(params);
  };
  const handleRun = () => {
    // @ts-ignore
    const params = variableRef.current!.getCurrentParmas();
    const context = paserParmasToContext(params);
    const code = getFuncBody(editor.getValue());
    console.dir(context);
    const sandbox = createSandbox(context);
    const res = sandbox(code);
    setResult(res);
    // setRun(true)
  };
  const paserParmasToContext = (params: any[]) => {
    const context = {};
    params.map((item) => {
      const { key, value } = item;
      context[`${key}`] = value;
    });
    return context;
  };
  const handleFrameLoaded = () => {
    // @ts-ignore
    const params = variableRef.current!.getCurrentParmas();
    const context = paserParmasToContext(params);
    const code = getFuncBody(editor.getValue());
    const sandbox = createSandbox(context);
    const res = sandbox(code);
    setResult(res);
    // window.frames["preview"].createSandbox = createSandbox
    // window.frames["preview"].context = context
    // window.frames["preview"].code = code
    // window.frames["preview"].HY = window.top!.HY
  };
  return (
    <>
      <div className={styles["pro-demo"]}>
        <div className={styles["left-meun"]}>
          <Variable
            params = {currentFuncParams}
            ref={variableRef}
          />
          <Button onClick={handleRun}>运行</Button>
          <div className="result-code-box" >
            <div className="title">输出结果: </div>
            <div>{result}</div>
          </div>
          {/* {
            run && <iframe
            name="preview"
            onLoad={ handleFrameLoaded }
            src="http://localhost:8001/preview.html">

                </iframe>
          } */}
        </div>
        <div className={styles["center-editor"]}>
          <CodeEditor
            value= "function main() {}"
            mode="javascript"
            renderSelectMode={() => <></>}
            gutters = {["CodeMirror-lint-markers", "CodeMirror-linenumbers", "CodeMirror-foldgutter"]}
            getEditor={(ref) => editor = ref}
            hintOptions={{
              completeSingle: false,
              keywords: ['orderTime', 'contact', 'sysTime', 'user']
            }}
            onChange={handleCodeEditorChange}
          />
        </div>
        <div className={styles["right-menu"]}>
          <FuncTree
            onSelect = {handleSelectTreeNode}
          />
        </div>
      </div>
      {/* <Modal
        title="运行参数配置"
        visible={run}
        footer={null}
        maskClosable={false}
        destroyOnClose={true}
     >

    </Modal> */}
    </>
  );
};
export default Pro;
