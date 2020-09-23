/* eslint-disable no-param-reassign */
import { FoundationTypeSchemas } from '@iub-dsl/definition';
import { DefaultParserFn } from '../../types';

/** 可以使用默认基础类型解析器的key */
type FiledKey =('type' | 'defaultVal'| 'fieldMapping') & keyof FoundationTypeSchemas

/** 默认基础类型解析器 */
type DefaultFoundationTypeParser = DefaultParserFn<FoundationTypeSchemas>

/**
 * 生成内部默认字段解析器
 */
const defaultFieldParser = (key: string) => (schemaItem: FoundationTypeSchemas) => (schemaItem[key] !== undefined ? schemaItem[key] : '');
const defaultParserKey: FiledKey[] = ['type', 'defaultVal', 'fieldMapping'];
const defaultParserCollection = defaultParserKey.reduce((parser, key) => {
  parser[key] = defaultFieldParser(key);
  return parser;
}, {} as Record<FiledKey, DefaultFoundationTypeParser>);

export default defaultParserCollection;
