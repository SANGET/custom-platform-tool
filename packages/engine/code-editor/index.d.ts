// import { EditorConfiguration, Editor } from "codemirror"

// interface IExpandConfiguration extends EditorConfiguration {
//   matchBrackets?: boolean;
//   hintOptions?: any;
//   autoCloseBrackets?: boolean;
// }
// // declare interface Editor extends Doc {
// //   setOption<K extends keyof EditorConfiguration>(option: K, value: EditorConfiguration[K]): void;
// // }
// declare function CodeMirror(host: HTMLDivElement, options?: IExpandConfiguration): Editor;

interface window {
  JSHINT: any;
  jsonlint: any;
}
declare module '*'

declare module "codemirror/mode/javascript/javascript.js" {
  const content: any;
  export default content;
}
declare module "codemirror/addon/hint/javascript-hint.js" {
  const content: any;
  export default content;
}
declare module "codemirror/addon/lint/javascript-lint.js" {
  const content: any;
  export default content;
}
declare module "codemirror/mode/sql/sql.js" {
  const content: any;
  export default content;
}
declare module "codemirror/mode/shell/shell.js" {
  const content: any;
  export default content;
}
declare module "codemirror/addon/hint/sql-hint.js" {
  const content: any;
  export default content;
}
declare module "codemirror/mode/textile/textile.js" {
  const content: any;
  export default content;
}
declare module "codemirror/addon/hint/anyword-hint.js" {
  const content: any;
  export default content;
}

declare module "codemirror/addon/lint/json-lint.js" {
  const content: any;
  export default content;
}
