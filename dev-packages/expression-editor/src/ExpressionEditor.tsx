import React, { PureComponent } from 'react'
import CodeEditor from '@engine/code-editor'
import codeEngine from '@engine/lowCode'
import createSandbox from '@engine/js-sandbox'
import { Row, Col, Button } from 'antd'
import Variable from './component/variable'
import Function from './component/function'
import Description from './component/description'
import { VARIABLE_DATA, FUNCTION_TREE } from "./config"
import 'antd/dist/antd.css';
import "./index.less"
interface IProps {

}
interface IState {
  hintOptions: Object;
  selectFuncNode: any;
  cacheFuncNode: any;
  operationResult: string;
}
class ExpressionEditor extends PureComponent<IProps, IState> {
  public editor: any
  constructor(props: IProps) {
    super(props)
    this.editor = null
    this.state = {
      selectFuncNode: {},
      cacheFuncNode: {},
      hintOptions: {
        completeSingle: false,
        keywords: []
      },
      operationResult: ""
    }
  }
  public componentDidMount() {
    this.setHintOptions()
  }
  public insertValue = (code: string, pos = 0) => {
    const cur = this.editor.getCursor()
    this.editor.replaceRange(code, cur, cur, '+insert')
    setTimeout(() => {
      const cur = this.editor.getCursor()
      this.editor.setCursor({ line: cur.line, ch: cur.ch - pos })
    }, 500)

  }
  public debugerCode = async () => {
    const code = this.editor.getValue()
    const mappingSrouce = this.variableMapping("title", "key")
    if (code) {
      try {
        const str = codeEngine(code, { identifierMapping: mappingSrouce })
        console.dir(str)
        const context = this.getVariableValue()
        const sandbox = createSandbox({ ...context }, {})
        const res = await sandbox(str)
        this.setState({
          operationResult: res
        })

      } catch (error) {
        console.dir(error)
        this.setState({
          operationResult: error.toString()
        })
      }
    }
  }
  public variableMapping(targetKey: string, sourceKey: string) {
    const obj = {}
    VARIABLE_DATA.map(item => {
      item.props.forEach(props => {
        obj[props[targetKey]] = props[sourceKey]
      })
    })
    return obj
  }
  public getVariableValue() {
    const variable = {}
    VARIABLE_DATA.map(item => {
      item.props.forEach(props => {
        const keys = props.key.split(".")
        if (!variable[keys[0]]) {
          variable[keys[0]] = {}
        }
        variable[keys[0]][keys[1]] = props.value
      })
    })
    return variable
  }
  public getVariableHintName() {
    const hint: string[] = []
    VARIABLE_DATA.map(item => {
      item.props.forEach(props => {
        hint.push(props.title)
      })
    })
    return hint
  }
  public setHintOptions() {
    const keywords = this.getVariableHintName()
    this.setState({
      hintOptions: {
        completeSingle: false,
        keywords: keywords
      }
    })
  }
  public handleFuncSelect = (info: any) => {
    const { node } = info
    this.setState({
      selectFuncNode: node,
      cacheFuncNode: node
    })
    this.insertValue(node.name, 1)
  }
  public handleFuncMouseEnter = (info: any) => {
    const { node } = info
    this.setState({
      selectFuncNode: node
    })
  }
  render() {
    const { selectFuncNode, operationResult } = this.state
    return (
      <div className="expression-editor">
        <Button onClick={this.debugerCode}>调试</Button>
        <span>输出结果: {operationResult}</span>
        <CodeEditor
          theme="ttcn"
          value=""
          mode="javascript"
          renderToolBar={() => <></>}
          lint={false}
          height="200px"
          gutters={["CodeMirror-linenumbers"]}
          getEditor={(ref) => this.editor = ref}
          hintOptions={this.state.hintOptions}
        />
        <Row className="action-bar">
          <Col xs={24} sm={12} md={24} lg={7} xl={7}>
            <Variable
              variableData={VARIABLE_DATA}
              onClick={this.insertValue}
            />
          </Col>
          <Col xs={24} sm={12} md={24} lg={{ span: 7, offset: 1 }} xl={{ span: 5, offset: 1 }}>
            <Function
              funcTreeData={FUNCTION_TREE}
              onSelect={this.handleFuncSelect}
              onMouseEnter={this.handleFuncMouseEnter}
            />
          </Col>
          <Col xs={24} sm={12} md={24} lg={{ span: 7, offset: 1 }} xl={{ span: 10, offset: 1 }}>
            <Description
              title={selectFuncNode.title}
              description={selectFuncNode.description}
            />
          </Col>
        </Row>
      </div>
    )
  }
}
export default ExpressionEditor
