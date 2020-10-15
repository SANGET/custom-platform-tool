import CodeCompiler, { IOptions } from './src/CodeEngine';

export default function codeEngine(code: string, options: IOptions) {
  const compiler = new CodeCompiler(options);
  const conveCode = compiler.codeIsExpression(`(function(){${code}})`)
    ? `(async function() { return ${code} })()`
    : `(async function() { ${code} })()`;
  compiler.setCode(conveCode);
  return compiler.getCompileCode();
}
