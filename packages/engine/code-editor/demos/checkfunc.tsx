import React, { ReactElement } from 'react';
import CodeEditor from '@engine/code-editor';
import { Tree, Row, Col } from 'antd';
import { Key } from 'antd/lib/table/interface';
import { EventDataNode, DataNode } from 'antd/lib/tree';
import { parse } from '@babel/parser';

const Home: React.FC = (): ReactElement => {
  let editor: any;
  const treeData = [{
    title: 'HY',
    key: '0-0',
    children: [
      {
        title: '函数',
        key: '0-0-0',
        children: [
          {
            title: '求和',
            key: '0-0-0-0',
            value: "function sum(a,b) { return a + b;}"
          }
        ]
      },
      {
        title: '系统类',
        key: '0-0-1',
        children: [
          {
            title: '获取最大值',
            key: '0-0-1-0',
            value: "Math.max()"
          }
        ]
      },
    ],
  }];
  const handleSelectNode = (selectedKeys: Key[], info: {
    event: 'select';
    selected: boolean;
    node: EventDataNode;
    selectedNodes: DataNode[];
    nativeEvent: MouseEvent;
  }) => {
    console.dir(editor);
    const cur = editor.getCursor();
    console.dir(cur);
    editor.replaceRange(info.node.value, cur, cur, '+insert');
    editor.setCursor({ line: cur.line + 1, ch: cur.ch + 1 });
    // console.dir(selectedKeys)
    // console.dir(info.node.value!)
    // console.dir(info.nativeEvent)
    // console.dir(info.event)
    // console.dir(info.nativeEvent)
  };
  console.dir(parse('A(a,b)+B(C(c,d),e)', { sourceType: "script" }));
  return (
    <Row justify="start">
      <Col flex="auto">
        <CodeEditor
          value= ""
          mode="javascript"
          getEditor={(ref) => editor = ref}
        />
      </Col>
      <Col flex="200px">
        <Tree
          defaultExpandAll={true}
          treeData={treeData}
          onSelect={handleSelectNode}
        />
      </Col>
    </Row>

  );
};
export default Home;
