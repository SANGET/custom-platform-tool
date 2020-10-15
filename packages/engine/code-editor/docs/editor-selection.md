---
title: 低代码编辑器技术选型
order: 2
group:
  path: /
nav:
  title: 设计文档
  order: 3
  path: /design
---

## 技术选型

### 选型方向

目前开源的代码编辑器有很多。在选择方向个人主要从编辑器的维护和更新状态、功能完备度、扩展性、外观/交互、官网/文档/api/demo、支持/维护/社区、兼容性(浏览器)等方面进行对比筛选。

### 编辑器统计数据

统计来源： [Wikipedia](https://en.wikipedia.org/wiki/Comparison_of_JavaScript-based_source_code_editors)

源代码编辑器列表

![图片描述](https://www.tapd.cn/tfl/pictures/202007/tapd_41909965_1595402546_13.png)

源代码编辑器功能列表

![图片描述](https://www.tapd.cn/tfl/pictures/202007/tapd_41909965_1595402791_61.png)

### 选型指标

1. 最后的版本发布时间
2. 活跃状况(维护和更新状态)
3. 是否开源
4. 语法主题高亮
5. 自动补全缩进
6. 快捷键操作
7. 搜索和替换等功能

### 编辑器选择

综合上述两个表的数据，结合部分编辑器的官网介绍和demo，筛选出三款编辑器：[Ace](https://en.wikipedia.org/wiki/Ace_%28editor%29)、[CodeMirror](https://en.wikipedia.org/wiki/CodeMirror)、[Monaco Editor](https://en.wikipedia.org/w/index.php?title=Monaco_Editor&amp;action=edit&amp;redlink=1) 进行更细致全面的比较。

### 各编辑器介绍

#### CodeMirror

CodeMirror是一个用JavaScript为浏览器实现的多功能文本编辑器。它专门用于编辑代码，并附带一些实现更高级编辑功能的语言模式和插件。其核心仅提供编辑器功能，其他功能通过丰富的API和插件实现。CodeMirror的使用基于特定的程序语言模式(mode)，它对特定的语言进行语法解析(parse)，使编辑器能够在解析结果基础上进行语法高亮，实现具有上下文感知(context-aware)的代码补全、缩进等功能。

![图片描述](https://cdn.jsdelivr.net/gh/18613109040/editor/public/images/tapd_41909965_1596457095_7.png)

##### 创建编辑器实例：

1.编辑器将append到 container元素中：CodeMirror(container, options);
2.或者直接替换textarea元素：CodeMirror.fromTextArea(myTextArea);

##### 配置

默认配置从CodeMirror.defaults中获取。可以更新此对象以更改页面上的默认值，例如配置 输入初始值， 语法模式， 风格主题， 键盘映射， 快捷键绑定。

##### event(事件)

各种与CodeMirror相关的对象发出事件，这些事件允许客户端代码对各种情况作出反应。事件的处理程序可以用事件触发对象的on和off方法进行注册，主要由四类事件：编辑器实例、文档实例、代码行、文本范围。

##### keymap(键盘映射)

键映射是将键和鼠标按钮与功能相关联的方式.键映射是一个映射字符串的对象，它将按钮标识为实现其功能的函数。带有Emacs，Vim和Sublime Text-style键盘映射。可以使用extraKey配置或command 
API自定义。

##### command(命令)

命令是可以在编辑器上执行的无参数操作。他们主要用于键绑定。库本身定义了许多常用命令，其中大多数命令由默认的键绑定使用定义命令：CodeMirror.commands，执行命令：  execCommand。

##### 自定义样式

CodeMirror的外观可以通过修改css文件实现。mode提供的css文件只是为该模式提供颜色。编辑器本身的样式通过改变或覆盖 codemirror.css的实现
codemirror提供了必须定义的css类名，css文件必须包括这些类名才能保证编辑器的正常工作，主题也是css文件，定义了各种语法元素的颜色 查看 /theme 目录。

##### API

许多CodeMirror功能只能通过其API访问。因此，如果您想将其公开给用户，则需要编写代码（或使用插件）。包括内容操作，光标和选择，配置，文件管理等方法。每个编辑器都与其文档CodeMirror.Doc的一个实例相关联，一个文档代表编辑器的内容，外加一个选择，一个撤消历史和一个模式，一个文档一次只能与一个编辑器关联，文档实例拥有历史操作、文本标记、工具、大小，滚动和定位、模式，状态和令牌相关的方法。

##### addon(插件)

插件目录包含许多可重用的组件，这些组件实现了额外的编辑器功能，例如代码提示，代码补全，搜索和替换

##### 编写mode

mode最简单的定义了一个词法解析器，解析编辑器的内容，更高级的模式也可以处理语言的缩进。(相当于写一个语法解析器，比较复杂，不具体描述)

##### 功能表

|             语言       |110+ mode|
|---|---|
|可组合的mode系统|option: parserfile(HTML mixed mode)|
|自动完成|addon/hint，支持上下文感知|
|代码折叠|addon/fold|
|快捷键配置|option: extraKeys|
|编辑器绑定|option: keyMap|
|搜索与替换|addon/search|
|自动补全|addon/edit|
|多视图|editor.swapDoc()|
|代码检查|引入JSLINT+addon/lint|
|字体样式混入|css class|
|多主题|/theme|
|自动调整宽高|option: viewportMargin|
|行内/块级 部件|editor.addLineWidget|
|断点|option: gutter|
|标记文本范围|editor.markText()|
|文本方向|option: direction|
|丰富的API和插件|...|

##### codemirror通过插件实现了一些特别的功能，例如：

| 功能 | 链接  |
|---|---|
|添加widget|[http://codemirror.net/demo/widget.html/](http://codemirror.net/demo/widget.html)|
|视图与代码的分离 Multiple Buffer &amp; Split View|[http://codemirror.net/demo/buffers.html/](http://codemirror.net/demo/buffers.html)|
|代码的多路复用 Multiplexing Parser|[http://codemirror.net/demo/multiplex.html/](http://codemirror.net/demo/multiplex.html)|
|基于Tern(高级javascript解析引擎))的高级智能功能|[http://codemirror.net/demo/tern.html/](http://codemirror.net/demo/tern.html)|

##### 附录

- 官网：[/http://codemirror.net//](http://codemirror.net/)
- github(star:20.8k issue:375): [/https://github.com/codemirror/CodeMirror//](https://github.com/codemirror/CodeMirror/)
- 外部插件: [/https://github.com/codemirror/CodeMirror/wiki/CodeMirror-addons/](https://github.com/codemirror/CodeMirror/wiki/CodeMirror-addons)
- 编写mode: [/http://codemirror.net/doc/manual.html#modeapi/](http://codemirror.net/doc/manual.html#modeapi)
- demo: [/http://codemirror.net/demo//](http://codemirror.net/demo/)
- 论坛：[/https://discuss.codemirror.net//](https://discuss.codemirror.net/)
- 用户(Adobe Brackets,Chrome DevTools,Firefox Developer Tools ...): [/http://codemirror.net/doc/realworld.html/](http://codemirror.net/doc/realworld.html)

##### 评价

|  |  |
|---|---|
|优点|1.功能总体完备2.扩展性高3.官网文档介绍详细，demo覆盖较全，插件也很多4.有专门的社区，管理维护较为活跃|
|缺点|1.功能需要配置和引入文件才能实现，功能多的时候需要引入的文件过多，不好管理。2.部分外观和交互基础显示不好，要通过自定义比较麻烦3.进行扩展需要一定的学习|

#### CE

Ace是一个用JavaScript编写的嵌入式代码编辑器。它与Sublime，Vim和TextMate等原生编辑器的功能和性能相匹配。它可以很容易地嵌入到任何网页和JavaScript应用程序中。作为与codemirror同类的现代编辑器，ACE同样拥有mode进行语法解析，实现编辑器的智能感知型功能。

![图片描述](https://cdn.jsdelivr.net/gh/18613109040/editor/public/images/tapd_41909965_1596508889_60.png)

Ace也实现了编辑器和代码文档的分离，Session管理代码的编辑状态，Document为代码容器，TextMode提供语言解析，为代码高亮和智能编辑提供支持，Editor为编辑器的核心，它处理代码的状态，处理IO事件，渲染编辑器组件。

##### 创建编辑器实例：

`ace.edit("editor")` 通过ace.edit直接创建，通过api设置编辑器

##### API

Ace主要分为Editor、Session、Document、Mode、VirtualRenderer五个模块，针对五个模块都有对应的API进行操作。通常用户使用较多的是Session类的API，涉及对编辑状态的获取和修改，如光标、选择、代码行、代码搜索等类的API方法都较为丰富。

##### 自定义Mode

Ace提供了非常详细完整的文档描述如何自定义一个语法高亮的模块扩展，其中包括编写mode(语法解析)、高亮规则、代码流的状态机、mode继承等，并提供了一个可在线预览的编辑环境。

##### 附录

官网： [https://ace.c9.io//](https://ace.c9.io/)

github ( star:21.9k issue:676): [https://github.com/ajaxorg/ace/](https://github.com/ajaxorg/ace)

编写mode: [https://ace.c9.io/tool/mode_creator.html/](https://ace.c9.io/tool/mode_creator.html)

demo: [https://ace.c9.io/build/kitchen-sink.html/](https://ace.c9.io/build/kitchen-sink.html)

社区：[https://groups.google.com/forum/#!forum/ace-discuss](https://groups.google.com/forum/#!forum/ace-discuss)

用户: [https://ace.c9.io/#nav=production/](https://ace.c9.io/#nav=production)

##### 评价

|  |  |
|---|---|
|优点|1.功能完备且集成度高 2.支持的语言丰富  3.支持在线编写mode和配置demo|
|缺点|1.扩展支持能力较为一般2.官方demo不支持源码预览|

#### monaco editor

monaco是VS Code的代码编辑器，同时也是一个开源代码编辑器，可以嵌入到Web应用程序中

![图片描述](https://cdn.jsdelivr.net/gh/18613109040/editor/public/images/tapd_41909965_1596509498_16.png )

##### 创建编辑器实例:

编辑器将append到 container元素中：`monaco.editor.create(container, options)`

##### API

monaco实现了vscode的编辑器，功能完备且集成度高，可以说即插即用，非常适合仅需编辑功能不考虑扩展和自定义样式的场景。API主要分为editor和language，涉及编辑器的操作使用editor提供的API，language主要进行代码程序语言的扩展。

##### 自定义语法

monaco有一个专门的库Monarch定义语法高亮，包括language(语言定义)，token(语法标记)，state(状态机)，rules(输入规则)等语言解析的模块，其中可以通过json文件直接定义语言，不用像另外两种编辑器那样编写程序。同样也支持语法的继承。支持高级功能如复杂的大括号匹配，语言定义的更多属性，复杂的动态结束标签。与Ace一样提供在线的语法定义的编辑预览。

##### 附录

官网： [https://microsoft.github.io/monaco-editor/index.html](https://microsoft.github.io/monaco-editor/index.html)

github ( star:21k issue:441): [https://github.com/microsoft/monaco-editor](https://github.com/microsoft/monaco-editor)

##### 评价

|  |  |
|---|---|
|优点|1.集成vscode的编辑功能，使用较为简单2.使用vscode的外观和交互较为友好4.原生支持代码diff，typescript|
|缺点|1.支持语言种类和主题较少2.扩展性较差3.独立的引入方式不适合打包3.不支持移动浏览器或移动Web框架|

### 总结

#### 功能点的对比

|功能点|ACE|CodeMirror|Monaco|
|---|---|---|---|
|代码着色/高亮|√|√|√|
|主题|√ (内置20+/可扩展)|√ (内置40+)|2种，即vs/vs dark|
|语言支持|√ (110+/可扩展)|√ (130+)|√ (30+)|
|代码提示/自动补全|√ (引入tool文件+配置)|√ 引入hint相关文件+配置快捷键命令|√ 默认开启|
|代码完成/循环结构|√|√|√|
|代码段|√|√|√|
|搜索和替换|√|√|√|
|多光标操作|√|√|√|
|自动缩进|√|√|√|
|代码折行|√|√|√|
|undo/redo|√|√|√|
|快捷键|√|√|√|
|代码检查lint|√|√|√|
|字符集支持|√|√||
|行数显示|√|√|√|
|代码对比diff||√|√|
|mixed mode混合模式||√||
|keymap键盘映射|√  vim and Emacs|√ ( [/Vim/](http://codemirror.net/demo/vim.html) ,  [/Emacs/](http://codemirror.net/demo/emacs.html) , and  [/Sublime Text/](http://codemirror.net/demo/sublime.html) )||
|多视图||√|√|
|resize自适应|√|√||
|扩展小部件||√||
|文本标记扩展||√||
|命令行扩展|√|√|√|
|鼠标拖放扩展|√|√||

功能的整体对比来看，CodeMirror的功能比较多，但三者相差不大，基本功能都具备，只是某些特殊功能codemirror可以通过其丰富的扩展实现。

##### 综合对比

![图片描述](https://cdn.jsdelivr.net/gh/18613109040/editor/public/images/tapd_41909965_1596511218_46.png)

|特性|CodeMirror|Ace|monaco|
|---|---|---|---|
|功能|完备|完备|完备|
|扩展性|插件、主题、mode扩展|插件、主题、mode扩展|mode扩展|
|外观/交互|支持多款主题和部件基础UI较为简单|支持多款主题|vscode风格风格统一交互友好|
|文档/demo|官网详细的api文档demo单页展示|官网包含特性支持mode创建教程api文档demo操作区|API文档可配置demo功能样例+代码|
|支持/社区|独立社区star:20.8k+ issue:375+|star:21.9k issue:676+ |star:21+k issue:441+ support:Microsoft|
|兼容性|Firefox 3+, Chrome, Safari 3+, IE 8+, Opera 9+|Firefox 3.5+, Safari 4+, Chrome, IE 8+, Opera 11.5+|IE8+, Firefox 4+, Chrome|

综合以上对比，可以对三款编辑器做出初步评价，三款功能基本完备，CodeMirror综合能力突出, 适合支持扩展性要求高的定制型编辑器。Ace上手简单，扩展也较为丰富。monaco集成度最高，引入文件量巨大，引入方式兼容性不太好，但功能实现完备，不需另外的扩展引入，适合需要实现复杂功能但不进行深度扩展的应用，因其不支持mobile且文件量大，在electron这类的客户端环境使用较为合适。

##### 技术定型

CodeMirror
