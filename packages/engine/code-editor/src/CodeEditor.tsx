import React, { PureComponent, RefObject, ReactElement } from 'react'
import CodeMirror, { Editor, EditorConfiguration, EditorFromTextArea, Doc } from 'codemirror'
import { RESOURCES_LIST, IResources, ALL_EVENTS } from './config'
import ToolBar from './component/ToolBar'
import { equals, firstUpperCase } from './util'
import 'codemirror/addon/display/placeholder' // 背景提示
import 'codemirror/addon/edit/matchbrackets' // 左右括号颜色高亮
import 'codemirror/addon/edit/closebrackets.js' // 当键入时将自动关闭方括号和引号。默认情况下，它将自动关闭()[]{}''""

import 'codemirror/lib/codemirror.css'
import './index.less'
/**
 * 编辑器事件
 * 具体查看  https://codemirror.net/doc/manual.html#events
 */
interface IEvent {
  /** 滚动编辑器时触发 */
  onScroll?: (instance: Editor) => void;
  /** 每次更改编辑器的内容时​​触发。 */
  onChange?: (instance: Editor, changeObj: object) => void;
  /** 在应用更改之前会触发此事件，并且其处理程序可以选择修改或取消更改。  */
  onBeforeChange?: (instance: Editor, changeObj: object) => void;
  /** 每当此文档中的光标或选择更改时触发  */
  onCursorActivity?: (instance: Editor) => void;
  /** 通过键映射处理键后触发。 */
  onKeyHandled?: (instance: Editor, name: string, event: Event) => void;
  /** 每当从隐藏的文本区域读取新输入（由用户键入或粘贴）时，将触发此事件。 */
  onInputRead?: (instance: Editor, changeObj: object) => void;
  /** 如果文本输入与模式的电子模式匹配，则触发该事件，从而导致该行的缩进发生更改。 */
  onElectricInput?: (instance: Editor, line: number) => void;
  /** 在移动所选内容之前会触发此事件。 */
  onBeforeSelectionChange?: (instance: Editor, changeObj: object) => void;
  /** 每当编辑器的视图端口发生更改（由于滚动，编辑或任何其他因素）时触发。 */
  onViewportChange?: (instance: Editor, from: number, to: number) => void;
  /**将新文档附加到编辑器。返回旧文档，该文档现在不再与编辑器关联。 */
  onSwapDoc?: (doc: CodeMirror.Doc) => Doc;
  /** 单击编辑器装订线（行号区域）时触发。 */
  onGutterClick?: (instance: Editor, line: number, gutter: string, clickEvent: Event) => void;
  /** 当编辑器装订线（行号区域）接收到上下文菜单事件时触发。*/
  onGutterContextMenu?: (instance: Editor, line: number, gutter: string, contextMenu: Event) => void;
  /** 每当编辑器聚焦触发 */
  onFocus?: (instance: Editor, event: Event) => void;
  /** 每当编辑器失去焦点时触发。 */
  onBlur?: (instance: Editor, event: Event) => void;
  /** 刷新或调整编辑器大小时触发 */
  onRefresh?: (instance: Editor) => void;
  /** 每次使用setOption 触发 */
  onOptionChange?: (instance: Editor, option: string) => void;
  /** 当编辑器尝试将其光标滚动到视图时触发 */
  onScrollCursorIntoView?: (instance: Editor, event: Event) => void;
  /** 每当CodeMirror更新其DOM显示时将被触发 */
  onUpdate?: (instance: Editor) => void;
}
/**
 * 编辑器对外暴露属性
 */
interface ICodeEditorProps extends EditorConfiguration, IEvent {
  hintOptions: any;
  /** 是否只读 */
  readOnly?: string | boolean;
  /** 初始值 */
  value?: string | undefined;
  /** 是否加载hint */
  hint?: boolean;
  /** 是否加载lint */
  lint?: boolean;
  /** 是否加载search */
  search?: boolean;
  /** 是否可以全屏 */
  fullscreen?: boolean;
  /** 自定义资源 */
  cusResourceList: IResources | IResources[];
  /** 获取 Editor 实例*/
  getEditor?: (editor: any) => any;
  /** 宽度 */
  width?: string;
  /** 高度 */
  height?: string;
  /** 自定义注册 */
  registerHelper?: (editor: Editor , options: EditorConfiguration) => {};
  /** 实例化完成 */
  ready?: (editor: Editor, codeMirror: any ) => {};
  renderSelectTheme?: () =>  ReactElement;
  renderSelectMode?: () => ReactElement;
  renderSelectFontSize?: () => ReactElement;
  renderToolBar?: () => ReactElement;
}
interface IICodeEditorState {
  /** 函数输出结果 */
  funcResult: string;
  /** 运行参数弹框 */
  visibleRunModal: boolean;
  /** 单前运行函数参数 */
  funcParams: string[];
}
class CodeEditor extends PureComponent<ICodeEditorProps, IICodeEditorState> {
  private codeRef: RefObject<HTMLTextAreaElement> = React.createRef()
  public editor: EditorFromTextArea | undefined
  public static defaultProps: ICodeEditorProps  = {
    readOnly: false,
    mode: "javascript",
    theme: "dracula",
    lint: true,
    hint: true,
    search: false,
    fullscreen: false,
    autofocus: false,
    value: "",
    hintOptions: {
      completeSingle: false,
    },
    width: "100%",
    height: "100%",
    cusResourceList: [],
  }
  public constructor(props: ICodeEditorProps) {
    super(props)
    this.state = {
      funcResult: "",
      visibleRunModal: false,
      funcParams: [],
    }
  }
  public async componentDidMount() {
    await this.defaultImportCodeMirror()
    this.initCodeMirror()
  }
  /**
   * 初始化 CodeMirror
   */
  public initCodeMirror(): void {
    const { mode, theme, lint, foldGutter, autofocus, extraKeys, hintOptions, value, registerHelper, width, height,  ...configuration } = this.props
    const gutters = this.getGutters()
    this.editor = CodeMirror.fromTextArea(this.codeRef.current!, {
      mode,
      tabSize: 2,
      lineNumbers: true,
      indentWithTabs: true,
      lineWrapping: true,
      matchBrackets: true,
      autoCloseBrackets: true,
      smartIndent: true,
      theme: theme,
      autofocus: autofocus,
      extraKeys,
      foldGutter,
      lint,
      gutters,
      hintOptions: {
        completeSingle: false,
        ...hintOptions,
      },
      ...configuration,
    })
    /** 设置窗口大小 */
    this.editor.setSize(width, height)
    /** 设置编辑器初始值 */
    value && this.setCodeMirrorValue(value)
    this.onInputRead({completeSingle: false})
    /** 外部获取editor 实例 */
    this.props.getEditor && this.props.getEditor(this.editor)
    /** 初始化编辑器后 获取editor 和  CodeMirror*/
    this.props.ready && this.props.ready(this.editor, CodeMirror)
    /** 初始化事件 */
    this.inintEvent()
  }

  /**
   * 组件离开 销毁 CodeMirror
   */
  public componentWillUnmount(): void {
    this.editor?.toTextArea()
  }
  /**
   * 初始化事件
   */
  public inintEvent(): void {
    ALL_EVENTS.forEach((event) => {
      this.props[`on${firstUpperCase(event)}`] && this.editor!.on(event, this.props[`on${firstUpperCase(event)}`])
    })
  }
  /**
   * 默认加载资源列表里mode 和对应的提示 hint 对应主题样式theme
  */
  public async defaultImportCodeMirror() {
    const { lint, foldGutter, hint, search, fullscreen } = this.props
    if (foldGutter) await this.loadFoldResource()
    if (lint) await this.loadLintResource()
    if (hint) await this.loadHintResource()
    if (search)  await this.loadSearchResource()
    if (fullscreen) await this.loadFullScreenResource()
    await this.loadCodeMirrorResource()
  }
  /**
   * 加载默认 CodeMirror 依赖资源
   */
  public async loadCodeMirrorResource() {
    const { mode, theme } = this.props
    const cusResources = this.mergeResource()
    const findResource = cusResources.find(item => item.mode === mode)
    if(findResource) {
      findResource.dependentJs && await findResource.dependentJs()
      findResource.dependentHint && await findResource.dependentHint()
      findResource.dependentLint && await findResource.dependentLint()
    }
    await import(`codemirror/theme/${theme}.css`)
  }
   /**
   *  加载全屏资源
   */
  public loadFullScreenResource(): Promise<any> {
    return Promise.all([
      require('codemirror/addon/display/fullscreen.css'),
      require('codemirror/addon/display/fullscreen.js'),
    ])
  }
  /**
   *  加载搜索资源
   */
  public loadSearchResource(): Promise<any> {
    return Promise.all([
      require('codemirror/addon/dialog/dialog.css'),
      require('codemirror/addon/search/matchesonscrollbar.css'),
      require('codemirror/addon/search/searchcursor.js'),
      require('codemirror/addon/search/search.js'),
      require('codemirror/addon/scroll/annotatescrollbar.js'),
      require('codemirror/addon/search/matchesonscrollbar.js'),
      require('codemirror/addon/search/jump-to-line.js'),
     ])
  }
  /**
   * 代码折叠 所需加载资源
   */
  public loadFoldResource(): Promise<any> {
    return Promise.all([
      require('codemirror/addon/fold/foldgutter.js'),
      require('codemirror/addon/fold/foldcode.js'),
      require('codemirror/addon/fold/brace-fold.js'),
      require('codemirror/addon/fold/foldgutter.css')
     ])
  }
  /**
   * 需要用到lint 加载的公共资源 每个lint还需单独加载
   */
  public loadLintResource(): Promise<any> {
    return Promise.all([
      require('codemirror/addon/lint/lint.js'),
      require('codemirror/addon/lint/lint.css')
     ])
  }
  /**
   * 需要hint加载资源
   */
  public loadHintResource(): Promise<any> {
    return Promise.all([
      require('codemirror/addon/hint/show-hint.js'),
      require('codemirror/addon/hint/show-hint.css')
     ])
  }
  /**
   * 获取需要 添加的 gutters
   */
  public getGutters(): string[] {
    const { lint, foldGutter } = this.props
    let gutters: string[] = []
    if(lint) gutters =[...gutters, 'CodeMirror-lint-markers']
    if(foldGutter) gutters =[...gutters, 'CodeMirror-linenumbers','CodeMirror-foldgutter']
    return gutters
  }
  /**
   * @TODO 有 closebrackets 插件 没用
   * 自动补全功能
   * 目前自动补全() 和 {}
   */
  public AutoInsertParentheses(): void {
    this.editor!.addKeyMap({
      name: 'autoInsertParentheses',
      "'('": (cm) => {
          const cur = cm.getCursor()
          cm.replaceRange('()', cur, cur, '+insert')
          cm.setCursor({ line: cur.line, ch: cur.ch + 1 })
      },
      "'{'": (cm) => {
        const cur = cm.getCursor()
        cm.replaceRange('{}', cur, cur, '+insert')
        cm.setCursor({ line: cur.line, ch: cur.ch + 1 })
      },
    })
  }
  /**
   * hintOptions 更新提示
   * @param prevProps
   */
  public componentDidUpdate(prevProps: ICodeEditorProps) {
    if(!equals(prevProps.hintOptions, this.props.hintOptions)) {
      this.editor!.setOption('hintOptions', this.props.hintOptions);
      this.onInputRead(this.props.hintOptions)
    }
    if(prevProps.value !== this.props.value) {
      this.setCodeMirrorValue(this.props.value!)
    }
  }
  /**
   * 动态设置 编辑器的值
   * @param value
   */
  public setCodeMirrorValue = (value: string) => {
    this.editor!.setValue(value)
  }
  /**
   * 每当从隐藏的文本区域中读取新输入（由用户键入或粘贴）时，就会触发
   */
  public onInputRead = (hintOptions: any) => {
    this.editor!.on('inputRead', (cm, change) => {
      cm.execCommand('autocomplete');
    })
  }
  /**
   * 设置语法模式
   * @param mode
   */
  public setCodeMirrorOption<K extends keyof EditorConfiguration>(option: K, value: string) {
    this.editor!.setOption(option, value)
  }
  /**
   * toolBar 改变编辑器主题 设置编辑器主题
   * @param value 主题颜色值
   */
  public handleThemeChange = (value: string) => {
    this.setCodeMirrorOption("theme", value)
  }
  /**
   * toolBar 改变编辑语法 设置编辑器语法
   * @param value
   */
  public handleModeChange = (value: string): void => {
    this.setCodeMirrorOption("mode", value)
  }
  /**
   * 根据 cusResourceList 类型 进行合并
   */
  public mergeResource() {
    const { cusResourceList } = this.props
    return Object.prototype.toString.call(cusResourceList) === "[object Object]" ? [...RESOURCES_LIST, cusResourceList as IResources]:  [...RESOURCES_LIST, ...cusResourceList as IResources[]]
  }
  public render(): ReactElement {
    const { mode, renderSelectTheme, renderSelectMode, renderSelectFontSize, renderToolBar } = this.props
    const cusResources = this.mergeResource()
    return (
      <>
        {/*  编辑器 */}
        <textarea ref={this.codeRef}></textarea>
        {/* 操作栏 */}
        {
          renderToolBar ? renderToolBar() : <ToolBar
              onThemeChange={this.handleThemeChange}
              onModeChange={this.handleModeChange}
              mode={mode}
              resourceList={cusResources}
              renderSelectTheme={renderSelectTheme}
              renderSelectMode={renderSelectMode!}
              renderSelectFontSize={renderSelectFontSize}
            />
        }
      </>
    )
  }
}

export default CodeEditor
