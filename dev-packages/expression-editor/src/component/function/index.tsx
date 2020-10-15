import React, { ReactElement, Key } from 'react'
import { Tree, Card } from 'antd'
import { ITreeNodeInfo, IFuncTree } from '../../interface'
import "./index.less"

interface IProps {
  onSelect?: (info: ITreeNodeInfo) => void;
  onMouseEnter?: (info: any) => void;
  funcTreeData: IFuncTree[];
}

const Function: React.FC<IProps> = (props: IProps): ReactElement => {
  const { onSelect, funcTreeData, onMouseEnter } = props
  const handleSelectNode = (selectedKeys: Key[], info: ITreeNodeInfo) => {
    if (info.node && info.node.description) {
      onSelect && onSelect(info)
    }
  }
  const handleTreeMouseEnter = (info: any) => {
    if (info.node && info.node.description) {
      onMouseEnter && onMouseEnter(info)
    }
  }
  return (
    <div className="tree-menu">
      <Card title="函数" >
        <Tree
          height={200}
          onSelect={handleSelectNode}
          treeData={funcTreeData}
          onMouseEnter={handleTreeMouseEnter}
        // onMouseLeave={handleTreeMouseLeave}
        />
      </Card>
    </div>
  )
}
export default React.memo(Function)
