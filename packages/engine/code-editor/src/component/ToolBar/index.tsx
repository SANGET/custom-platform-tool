import React, { ReactElement } from 'react'
import { Select } from 'antd'
import { THEMES_OPTION, FONT_SIZE } from '../../config'
const { Option } = Select
import "./index.less"
interface IProps {
  onThemeChange: (value: string) => void;
  onModeChange: (value: string) => void;
  resourceList: any[];
  mode: string;
  renderSelectTheme?: () => ReactElement;
  renderSelectMode?: () => ReactElement;
  renderSelectFontSize?: () => ReactElement;
}
/**
 * 编辑器操作栏 (默认包含 主题下拉框)
 * @param props: IProps
 */
const ToolBar = (props: IProps): ReactElement => {

  const { onThemeChange, onModeChange, resourceList, mode, renderSelectTheme, renderSelectMode, renderSelectFontSize } = props
  /**
   * 动态加载主题资源
   * @param name 主题名称 对应 codemirror/theme 下的样式文件
   * @returns Promise
   */
  const loadThemeResources = (name: string) => import(`codemirror/theme/${name}.css`)
  /**
   * 下拉框选择 onChange 事件
   * @param value
   */
  const handleThemeSelectChange = async (value: string): Promise<any> => {
    await loadThemeResources(value)
    onThemeChange && onThemeChange(value)
  }
  /**
   * 语法下拉框 onChange 事件
   * @returns ReactElement
   */
  const handleModeChange = async (value: string): Promise<any> => {
    const { dependentJs, dependentHint, dependentLint }  = resourceList.find(item => item.mode === value)
    dependentJs && await dependentJs()
    dependentHint && await dependentHint()
    dependentLint && await dependentLint()
    onModeChange && onModeChange(value)
  }
  /**
   * 改变字体大小 CodeMirror 没有提供可改变字体的api 所以改变 element 节点属性
   */
  const handleFontSizeChange = (value: string) => {
    const node: HTMLElement = document.getElementsByClassName("CodeMirror")[0] as HTMLElement
    node.style!.fontSize = value
  }

  /**
   * 主题下拉框 HTML
   * @returns ReactElement
   */
  const RenderThemeSelectEle = (): ReactElement =>
    renderSelectTheme ? renderSelectTheme() :
    <div className="select-node">
      <span>主题: </span>
      <Select defaultValue="dracula" onChange={handleThemeSelectChange}>
        {THEMES_OPTION.map((item, index) => <Option key={index} value={item.key}>{item.value}</Option>)}
      </Select>
    </div>
  /**
   * 语法下拉框
   * @returns ReactElement
   */
  const RenderModeSelectEle = (): ReactElement =>
    renderSelectMode ? renderSelectMode() :
    <div className="select-node">
      <span>语法: </span>
      <Select defaultValue={mode} style={{ width: 120 }} onChange={handleModeChange}>
        {
          resourceList.map((item, index) => <Option key={index} value={item.mode}>{item.mode}</Option>)
        }
      </Select>
    </div>

  /**
   * 字体下拉框
   * @returns ReactElement
   */
  const RenderFontSizeEle = (): ReactElement =>
    renderSelectFontSize ? renderSelectFontSize() : <div className="select-node">
      <span>字体大小: </span>
      <Select defaultValue="default" style={{ width: 120 }} onChange={handleFontSizeChange}>
        {
          FONT_SIZE.map((item, index) => <Option key={index} value={item.key}>{item.value}</Option>)
        }
      </Select>
    </div>
  return (
    <div className="tool-bar">
      <RenderThemeSelectEle />
      <RenderModeSelectEle />
      <RenderFontSizeEle/>
    </div>
  )
}

export default React.memo(ToolBar)
