export interface IBaseOption {
  key: string;
  value: string;
}

export const THEMES_OPTION: IBaseOption[] = [
  { key: "dracula", value: "dracula" },
  { key: "3024-day", value: "3024-day" },
  { key: "3024-night", value: "3024-night" },
  { key: "abcdef", value: "abcdef" },
  { key: "ambiance", value: "ambiance" },
  { key: "ayu-dark", value: "ayu-dark" },
  { key: "ayu-mirage", value: "ayu-mirage" },
  { key: "base16-dark", value: "base16-dark" },
  { key: "base16-light", value: "base16-light" },
  { key: "bespin", value: "bespin" },
  { key: "blackboard", value: "blackboard" },
  { key: "cobalt", value: "cobalt" },
  { key: "colorforth", value: "colorforth" },
  { key: "darcula", value: "darcula" },
  { key: "duotone-dark", value: "duotone-dark" },
  { key: "duotone-light", value: "duotone-light" },
  { key: "eclipse", value: "eclipse" },
  { key: "elegant", value: "elegant" },
  { key: "erlang-dark", value: "erlang-dark" },
  { key: "gruvbox-dark", value: "gruvbox-dark" },
  { key: "hopscotch", value: "hopscotch" },
  { key: "icecoder", value: "icecoder" },
  { key: "idea", value: "idea" },
  { key: "isotope", value: "isotope" },
  { key: "lesser-dark", value: "lesser-dark" },
  { key: "liquibyte", value: "liquibyte" },
  { key: "lucario", value: "lucario" },
  { key: "material", value: "material" },
  { key: "material-darker", value: "material-darker" },
  { key: "material-palenight", value: "material-palenight" },
  { key: "material-ocean", value: "material-ocean" },
  { key: "mbo", value: "mbo" },
  { key: "mdn-like", value: "mmdn-likebo" },
  { key: "midnight", value: "midnight" },
  { key: "monokai", value: "monokai" },
  { key: "moxer", value: "moxer" },
  { key: "neat", value: "neat" },
  { key: "neo", value: "neo" },
  { key: "night", value: "night" },
  { key: "nord", value: "nord" },
  { key: "oceanic-next", value: "oceanic-next" },
  { key: "panda-syntax", value: "panda-syntax" },
  { key: "paraiso-dark", value: "paraiso-dark" },
  { key: "paraiso-light", value: "paraiso-light" },
  { key: "pastel-on-dark", value: "pastel-on-dark" },
  { key: "paraiso-light", value: "paraiso-light" },
  { key: "pastel-on-dark", value: "pastel-on-dark" },
];

export const FONT_SIZE: IBaseOption[] = [
  { key: "", value: "default" },
  { key: "10px", value: "10" },
  { key: "11px", value: "11" },
  { key: "12px", value: "12" },
  { key: "13px", value: "13" },
  { key: "14px", value: "14" },
  { key: "15px", value: "15" },
  { key: "16px", value: "16" },
  { key: "17px", value: "17" },
  { key: "18px", value: "18" },
  { key: "19px", value: "19" },
  { key: "20px", value: "20" },
  { key: "21px", value: "21" },
  { key: "22px", value: "22" },
  { key: "23px", value: "23" },
  { key: "24px", value: "24" },
  { key: "25px", value: "25" },
  { key: "26px", value: "26" },
  { key: "27px", value: "27" },
  { key: "28px", value: "28" }
];
export const DATA_TYPE: IBaseOption[] = [
  { key: 'String', value: '字符串' },
  { key: 'Number', value: '数字' },
  { key: 'Array', value: '数组' },
  { key: 'Object', value: '对象' },
];

export const ALL_EVENTS: string[] = [
  'scroll',
  'change',
  'beforeChange',
  'cursorActivity',
  'keyHandled',
  'inputRead',
  'electricInput',
  'beforeSelectionChange',
  'viewportChange',
  'swapDoc',
  'gutterClick',
  'gutterContextMenu',
  'focus',
  'blur',
  'refresh',
  'optionChange',
  'scrollCursorIntoView',
  'update'
];
export interface IResources {
  mode?: string;
  dependentJs?: () => Promise<any> | PromiseConstructor | null;
  dependentHint?: () => Promise<any> | PromiseConstructor | null;
  dependentLint?: () => Promise<any> | PromiseConstructor | null;
}

/**
 * 默认代码code
 */
export const RESOURCES_LIST: IResources[] = [
  {
    mode: "javascript",
    dependentJs: () => import(`codemirror/mode/javascript/javascript.${"js"}`),
    dependentHint: () => import(`./hint/javascript-hint.${"js"}`),
    dependentLint: () => Promise.all([require("./lint/js-lint.js"), import(`codemirror/addon/lint/javascript-lint.${"js"}`)]),
  }, {
    mode: "sql",
    dependentJs: () => Promise.all([import(`codemirror/mode/sql/sql.${"js"}`), import(`codemirror/mode/shell/shell.${"js"}`)]),
    dependentHint: () => import(`codemirror/addon/hint/sql-hint.${"js"}`),
    dependentLint: () => null
  }, {
    mode: "text/x-textile",
    dependentJs: () => import(`codemirror/mode/textile/textile.${"js"}`),
    dependentHint: () => import(`codemirror/addon/hint/anyword-hint.${"js"}`)
  }, {
    mode: "application/json",
    dependentLint: () => import(`codemirror/addon/lint/json-lint.${"js"}`),
  }
];
