import React, { ReactElement, Key, useState } from 'react';
import { Tree, Card } from 'antd';
import CodeEditor from '@engine/code-editor';
import { FUNCTION_TREE } from './config';
import { ITreeNodeInfo } from './interface';
import "./style.less";

interface IProps {
  onSelect: (info: ITreeNodeInfo) => void;
}

const FuncTree: React.FC<IProps> = (props: IProps): ReactElement => {
  const [description, setDescription] = useState("");
  const { onSelect } = props;
  const handleSelectNode = (selectedKeys: Key[], info: ITreeNodeInfo) => {
    info.node.description && setDescription(info.node.description);
    onSelect(info);
  };
  return (
    <div className="tree-menu">
      <Card title="功能函数" style={{ width: 300 }}>
        <Tree
          height={200}
          onSelect={handleSelectNode}
          treeData={[FUNCTION_TREE]} defaultExpandAll
        />
      </Card>
      <Card title="函数说明" style={{ width: 300 }}>
        <CodeEditor
          value={description}
          mode="javascript"
          readOnly="nocursor"
          height="400"
          lint={false}
          hint={false}
          renderToolBar={() => <></>}
        />
      </Card>
    </div>
  );
};
export default React.memo(FuncTree);
