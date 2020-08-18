// Do this as the first thing so that any code reading it knows the right env.
process.env.BABEL_ENV = 'development';
process.env.NODE_ENV = 'development';

// Makes the script crash on unhandled rejections instead of silently
// ignoring them. In the future, promise rejections that are not handled will
// terminate the Node.js process with a non-zero exit code.
process.on('unhandledRejection', (err) => {
  throw err;
});

// Ensure environment variables are read.
require('../config/env');

const fs = require('fs');

const merge = require('webpack-merge');
const chalk = require('react-dev-utils/chalk');
const webpack = require('webpack');
const WebpackDevServer = require('webpack-dev-server');
const clearConsole = require('react-dev-utils/clearConsole');
const checkRequiredFiles = require('react-dev-utils/checkRequiredFiles');
const {
  choosePort,
  createCompiler,
  prepareProxy,
  prepareUrls,
} = require('react-dev-utils/WebpackDevServerUtils');
const openBrowser = require('react-dev-utils/openBrowser');
const paths = require('../config/paths');
const configFactory = require('../config/webpack.config');
const createDevServerConfig = require('../config/webpackDevServer.config');

const CustomerWebpackConfig = require('../config/get-customer-webpack-config');

const useYarn = fs.existsSync(paths.yarnLockFile);
const isInteractive = process.stdout.isTTY;

// Warn and crash if required files are missing
if (!checkRequiredFiles([paths.appHtml, paths.appIndexJs])) {
  process.exit(1);
}

// Tools like Cloud9 rely on this.
const DEFAULT_PORT = parseInt(process.env.PORT, 10) || 3000;
const HOST = process.env.HOST || '0.0.0.0';

if (process.env.HOST) {
  console.log(
    chalk.cyan(
      `Attempting to bind to HOST environment variable: ${chalk.yellow(
        chalk.bold(process.env.HOST)
      )}`
    )
  );
  console.log(
    `If this was unintentional, check that you haven't mistakenly set it in your shell.`
  );
  console.log(
    `Learn more here: ${chalk.yellow('https://bit.ly/CRA-advanced-config')}`
  );
  console.log();
}

// We require that you explicitly set browsers and do not fall back to
// browserslist defaults.
const { checkBrowsers } = require('react-dev-utils/browsersHelper');

checkBrowsers(paths.appPath, isInteractive)
  .then(() => {
    // We attempt to use the default port but if it is busy, we offer the user to
    // run on a different port. `choosePort()` Promise resolves to the next free port.
    return choosePort(HOST, DEFAULT_PORT);
  })
  .then((port) => {
    if (port == null) {
      // We have not found a port.
      return;
    }
    const srcConfig = configFactory('development');
    const config = merge(srcConfig, CustomerWebpackConfig || {});
    const protocol = process.env.HTTPS === 'true' ? 'https' : 'http';
    const appName = require(paths.appPackageJson).name;
    const useTypeScript = fs.existsSync(paths.appTsConfig);
    const urls = prepareUrls(protocol, HOST, port);
    const devSocket = {
      warnings: (warnings) => devServer.sockWrite(devServer.sockets, 'warnings', warnings),
      errors: (errors) => devServer.sockWrite(devServer.sockets, 'errors', errors),
    };
    // Create a webpack compiler that is configured with custom messages.
    const compiler = createCompiler({
      appName,
      config,
      devSocket,
      urls,
      useYarn,
      useTypeScript,
      webpack,
    });
    let serverConfig = {};
    // Load proxy config
    const proxySetting = require(paths.appPackageJson).proxy;
    /**
    * 如果从子项目的package.json 读取的proxy配置是对象,调用prepareProxy会出错,也特别处理一下
    */
    if (typeof proxySetting === 'object') {
      serverConfig = createDevServerConfig(
        proxySetting,
        urls.lanUrlForConfig
      );
    } else {
      const proxyConfig = prepareProxy(proxySetting, paths.appPublic);
      serverConfig = createDevServerConfig(
        proxyConfig,
        urls.lanUrlForConfig
      );
    }
    // }

    // console.log({ q: JSON.stringify(serverConfig), }, typeof proxySetting);

    // const test = {
    //   disableHostCheck: false,
    //   compress: true,
    //   clientLogLevel: "info",
    //   contentBase: "F:\\custom-platform-v3-frontend\\packages\\provider-app-hub\\DataDesigner\\public",
    //   watchContentBase: true,
    //   hot: true,
    //   publicPath: "/",
    //   quiet: true,
    //   watchOptions: {
    //     ignored: {}
    //   },
    //   https: false,
    //   host: "0.0.0.0",
    //   overlay: false,
    //   historyApiFallback: {
    //     disableDotRule: true
    //   },
    //   public: "10.7.1.186",
    //   proxy: {
    //     "/api": {
    //       target: "http://10.7.1.59:8080/paas/hy/smart_building",
    //       pathRewrite: {
    //         "^/api": ""
    //       },
    //       logLevel: "debug",
    //       changeOrigin: true,
    //       secure: false
    //     }
    //   }
    // };

    const devServer = new WebpackDevServer(compiler, serverConfig);
    // Launch WebpackDevServer.
    devServer.listen(port, HOST, (err) => {
      if (err) {
        return console.log(err);
      }
      if (isInteractive) {
        clearConsole();
      }

      // We used to support resolving modules according to `NODE_PATH`.
      // This now has been deprecated in favor of jsconfig/tsconfig.json
      // This lets you use absolute paths in imports inside large monorepos:
      if (process.env.NODE_PATH) {
        console.log(
          chalk.yellow(
            'Setting NODE_PATH to resolve modules absolutely has been deprecated in favor of setting baseUrl in jsconfig.json (or tsconfig.json if you are using TypeScript) and will be removed in a future major release of create-react-app.'
          )
        );
        console.log();
      }

      console.log(chalk.cyan('Starting the development server...\n'));
      openBrowser(urls.localUrlForBrowser);
    });

    ['SIGINT', 'SIGTERM'].forEach((sig) => {
      process.on(sig, () => {
        devServer.close();
        process.exit();
      });
    });
  })
  .catch((err) => {
    if (err && err.message) {
      console.log(err.message);
    }
    process.exit(1);
  });
