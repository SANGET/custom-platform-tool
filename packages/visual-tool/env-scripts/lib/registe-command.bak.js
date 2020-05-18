
const spawn = require('cross-spawn');
const program = require('commander');

const { version, scriptsRef } = require('./common-config');

const createScript = (scriptFileName, callback = (err) => {
  if(err) console.log(err);
}) => {
  // console.log(scriptFileName)
  const result = spawn.sync(
    'node',
    nodeArgs
      .concat(require.resolve('../scripts/' + script))
      .concat(args.slice(scriptIndex + 1)),
    { stdio: 'inherit' }
  );
  return () => exec(`node ${require.resolve(scriptFileName)}`, {

  }, callback);
}

program
  .version(version, '-v, --version');

for (const script of scriptsRef) {
  program
    .command(script)
    .action(createScript('../scripts/' + script));
}

program.parse(process.argv);