import React, { ReactElement } from 'react'
import { Card } from 'antd'
import CodeEditor from '@engine/code-editor'
import "./index.less"

interface IProps {
  title: string;
  description: string;
}

const Description: React.FC<IProps> = (props: IProps): ReactElement => {
  const { title, description } = props
  return (
    <Card title={title}>
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
  )
}
export default React.memo(Description)
