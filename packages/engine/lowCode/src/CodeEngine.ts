import { parse } from '@babel/parser';
import traverse from '@babel/traverse';
import generate from '@babel/generator';
import { transform } from '@babel/core';
import { File } from '@babel/types';

export interface IOptions {
  visitor?: Object | null;
  es5?: boolean;
  identifierMapping?: Object | null;
}

export default class CodeCompiler {
  /** 代码块 */
  private code: string;

  /** AST */
  private ast: File | null;

  /**  */
  private visitor: Object | null = null;

  private es5 = true;

  private identifierMapping: Object | null = null;

  constructor(options: IOptions) {
    this.code = '';
    this.ast = null;
    this.es5 = options?.es5 || false;
    this.identifierMapping = options?.identifierMapping || null;
    this.visitor = this.getVisitor(options?.visitor);
  }

  /**
   * 设置code值
   * @param code
   */
  public setCode(code: string) {
    this.code = code;
  }

  /**
   * 获取编译后的code
   */
  public getCompileCode() {
    return this.es5 ? this.codeTransformEs5() : this.astGenerateCode();
  }

  /**
   * 获取转换后的es5 代码字符串
   */
  public codeTransformEs5(): string {
    return transform(this.astGenerateCode(), {
      presets: [
        [
          require('@babel/preset-env'),
          {
            modules: false,
          },
        ],
      ],
    })?.code as string;
  }

  /**
   * 获取为转换的代码字符串
   */
  public astGenerateCode(): string {
    this.parseCodeToAst();
    this.traverseAst();
    return generate(this.ast as File, {
      comments: false,
    }).code;
  }

  /**
   * code 解析成AST
   */
  public parseCodeToAst(): void {
    this.ast = parse(this.code);
  }

  public codeIsExpression(code: string): boolean {
    // @ts-ignore
    const { expression } = parse(code).program.body[0];
    return (
      expression
      && expression.body.body.length === 1
      && expression.body.body[0].type === 'ExpressionStatement'
    );
  }

  /**
   * 变量AST 并对节点进行对应转化
   */
  public traverseAst(): void {
    traverse(this.ast as File, this.visitor!);
  }

  /**
   * 转化AST节点类型
   * @param visitor
   */
  public getVisitor(visitor: any) {
    if (visitor) {
      return visitor;
    }
    const { identifierMapping } = this;
    return {
      enter(path: any) {
        if (path.node.type === 'FunctionDeclaration') {
          path.node.async = true;
        }
        if (path.node.type === 'MemberExpression') {
          // @ts-ignore
          path.node.object.name = `await ${path.node.object.name}`;
        }
        if (path.node.type === 'CallExpression') {
          // @ts-ignore
          path.node.callee.name = `await ${path.node.callee.name}`;
        }
        if (path.node.type === 'Identifier') {
          if (identifierMapping![path.node.name]) {
            path.node.name = identifierMapping![path.node.name];
          }
        }
      },
      // Identifier(path: any) {
      //   if (identifierMapping![path.node.name]) {
      //     path.node.name = identifierMapping![path.node.name];
      //   }
      // }
    };
  }
}
