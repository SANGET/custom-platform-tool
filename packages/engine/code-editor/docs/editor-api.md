---
title: 代码编辑器API
order: 1
group:
  path: /
nav:
  title: API
  order: 1
  path: /api
---


# 配置项

## mode

- Type: `string|object`
- Default: `javascript`

编辑器语法

如果未指定，则默认为已加载的第一个模式。string 目前提供的值有 javascript , sql, text/x-textile  对象模式为（{name：“ javascript”，json：true}）

## theme

- Type: `string`
- Default: `dracula`

编辑器主题

主题颜色变量名称参照 [https://github.com/codemirror/CodeMirror/tree/master/theme](https://github.com/codemirror/CodeMirror/tree/master/theme)

## value

- Type: `string`
- Default: ``

编辑器内容

## hint

- Type: `boolean`
- Default: `true`

是否加载代码提示

## lint

- Type: `boolean`
- Default: `true`

是否加载代码检查

## search

- Type: `boolean`
- Default: `false`
  
是否开启搜索 如果想要更改快捷键可以修改 extraKeys 属性 例如: extraKeys :{"Alt-F": "findPersistent"}

Ctrl-F / Cmd-F 打开搜索

Shift-Ctrl-F / Cmd-Option-F 替换

Shift-Ctrl-R / Shift-Cmd-Option-F 全部替换

## width

- Type: `string`
- Default: `100%`

编辑器宽度

## height

- Type: `string`
- Default: `400px`

编辑器高度

## autofocus

- Type: `boolean`
- Default: `false`

自动获取焦点

## indentUnit

- Type: `number`
- Default: `2`

缩进多少个空格

## smartIndent

- Type: `boolean`
- Default: `true`

是否使用该模式提供的上下文相关的缩进（或仅缩进与前面的行相同）。

## tabSize

- Type: `number`
- Default: `2`
  
tab键缩进

## lineWrapping

- Type: `boolean`
- Default: `false`
  
是否应滚动或换行以显示长行

## lineNumbers

- Type: `boolean`
- Default: `false`
  
是否在编辑器的左侧显示行号

## firstLineNumber

- Type: `number`
- Default: `1`
  
从哪个数字开始计数行

## lineNumberFormatter

- Type: `function`
- Default: `function(line: number) => string`

用于格式化行号的功能。
该函数将传递给行号，并应返回一个将在装订线中显示的字符串。

## foldGutter

- Type: `boolean`
- Default: `true`

是否可折叠代码

## hintOptions

- Type: `object`
- Default: `{}`

代码提示, 是一个 Object 类型，包含如下配置：

### completeSingle

- Type: `boolean`
- Default: `false`

确定当仅单个完成可用时是否完成而不显示对话框。

### alignWithWord

- Type: `boolean`
- Default: `false`

弹出窗口应与单词的开头(true),还是光标（false）在水平方向上对齐。

### extraKeys

- Type: `keymap`
- Default: `{"Ctrl-Space": "autocomplete"}`

自定义键映射补全按键

### tables <Badge>sql模式独有</Badge>

- Type: `boolean`
- Default: `{key: string[]}`

sql hint 提示 格式如下
tables: { 表名: ['表字段'] }  
例：
```
tables: { table1: ['name', 'score', 'birthDate'], table2: ['bcd'], table3: ['edd'] }
```

## cusResourceList

- Type: `Array`
- Default: `[]`

自定义语法

```
[
  {
    mode: "xml",
    dependentJs:() => import("codemirror/mode/xml/xml.js"),  // 依赖的js
    dependentHint: null , // 依赖的提示， 如果没有就是null或者不写
    dependentLint: null,  // 依赖的lint， 如果没有就是null或者不写
  }
]
```

## getEditor

- Type: `function`
- Default: `(ref)=> void`

获取编辑器实例

```
getEditor={(ref) => editor = ref}
```

## Editor.setValue

- Type: `function`

设置编辑器的值 Editor 为获取编辑器的实例


## registerHelper

- Type: `function`
- Default: `(editor: Editor , options: EditorConfiguration) => void`

在给定的名称空间（类型）中注册具有给定名称的帮助程序值。这用于定义可以通过模式查找的功能。
```
CodeMirror.registerHelper("hint", "foo", myFoo)
```

## renderSelectTheme

- Type: `function`
- Default: `()=> ReactElement | null`
  
自定义编辑器主题 null 不显示

## renderSelectMode

- Type: `function`
- Default: `()=> ReactElement | null`
  
自定义编辑器语法 null 不显示

## renderSelectFontSize

- Type: `function`
- Default: `()=> ReactElement | null`
  
自定义编辑器字体 null 不显示

## renderRun

- Type: `function`
- Default: `()=> ReactElement | null`
  
自定义编辑器运行 null 不显示

## renderToolBar

- Type: `function`
- Default: `()=> ReactElement | null`
  
自定义编辑操作栏 null 不显示

## onScroll

- Type: `function`
- Default: `(instance: Editor) => void`

滚动编辑器时触发

## onChange

- Type: `function`
- Default: `(instance: Editor, changeObj: object) => void`

每次更改编辑器的内容时​​触发

## onBeforeChange

- Type: `function`
- Default: `(instance: Editor, changeObj: object) => void`

在应用更改之前会触发此事件，并且其处理程序可以选择修改或取消更改

## onCursorActivity

- Type: `function`
- Default: `(instance: Editor, changeObj: object) => void`

每当此文档中的光标或选择更改时触发

## onKeyHandled

- Type: `function`
- Default: `(instance: Editor, name: string, event: Event) => void`

通过键映射处理键后触发

## onInputRead

- Type: `function`
- Default: `(instance: Editor, changeObj: object) => void`

每当从隐藏的文本区域读取新输入（由用户键入或粘贴）时，将触发此事件。

## onElectricInput

- Type: `function`
- Default: `(instance: Editor, line: number) => void`

如果文本输入与模式的电子模式匹配，则触发该事件，从而导致该行的缩进发生更改。

## onBeforeSelectionChange

- Type: `function`
- Default: `(instance: Editor, changeObj: object) => void`

在移动所选内容之前会触发此事件。

## onViewportChange

- Type: `function`
- Default: `(instance: Editor, from: number, to: number) => void`

每当编辑器的视图端口发生更改（由于滚动，编辑或任何其他因素）时触发。

## onSwapDoc

- Type: `function`
- Default: `(doc: CodeMirror.Doc) => Doc`

将新文档附加到编辑器。返回旧文档，该文档现在不再与编辑器关联

## onGutterClick

- Type: `function`
- Default: `(instance: Editor, line: number, gutter: string, clickEvent: Event) => void`

单击编辑器装订线（行号区域）时触发。

## onGutterContextMenu

- Type: `function`
- Default: `(instance: Editor, line: number, gutter: string, contextMenu: Event) => void`

当编辑器装订线（行号区域）接收到上下文菜单事件时触发

## onFocus

- Type: `function`
- Default: `(instance: Editor, event: Event) => void`

每当编辑器聚焦触发

## onBlur

- Type: `function`
- Default: `(instance: Editor, event: Event) => void`

每当编辑器失去焦点时触发。

## onRefresh

- Type: `function`
- Default: `(instance: Editor, event: Event) => void`

刷新或调整编辑器大小时触发

## onOptionChange

- Type: `function`
- Default: `(instance: Editor, event: Event) => void`

每次使用setOption 触发 

## onScrollCursorIntoView

- Type: `function`
- Default: `(instance: Editor, event: Event) => void`

当编辑器尝试将其光标滚动到视图时触发 

## onUpdate

- Type: `function`
- Default: `(instance: Editor) => void`

每当CodeMirror更新其DOM显示时将被触发
