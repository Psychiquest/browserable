// Do this as the first thing so that any code reading it knows the right env.
process.env.BABEL_ENV = 'development';
process.env.NODE_ENV = 'development';

// Makes the script crash on unhandled rejections instead of silently
// ignoring them. In the future, promise rejections that are not handled will
// terminate the Node.js process with a non-zero exit code.
process.on('unhandledRejection', error => {
  throw error;
});

// Ensure environment variables are read.
require('../config/env');

const chalk = require('react-dev-utils/chalk');
const webpack = require('webpack');
const WebpackDevServer = require('webpack-dev-server');
const clearConsole = require('react-dev-utils/clearConsole');
const { checkBrowsers } = require('react-dev-utils/browsersHelper');
const checkRequiredFiles = require('react-dev-utils/checkRequiredFiles');
const openBrowser = require('react-dev-utils/openBrowser');
const {
  choosePort,
  createCompiler,
  prepareProxy,
  prepareUrls,
} = require('react-dev-utils/WebpackDevServerUtils');

const paths = require('../config/paths');
const configFactory = require('../config/webpack.config');
const createDevServerConfig = require('../config/webpackDevServer.config');

const isInteractive = process.stdout.isTTY;

// Warn and crash if required files are missing
if (!checkRequiredFiles([paths.appHtml, paths.appIndex])) {
  process.exit(1);
}

// Tools like Cloud9 rely on this.
const DEFAULT_PORT = parseInt(process.env.PORT, 10) || 2001;
const HOST = process.env.HOST || '0.0.0.0';

if (process.env.HOST) {
  console.log(
    chalk.cyan(
      `Attempting to bind to HOST environment variable: ${chalk.yellow(
        chalk.bold(process.env.HOST),
      )}`,
    ),
  );
  console.log("If this was unintentional, check that you haven't mistakenly set it in your shell.");
  console.log(`Learn more here: ${chalk.yellow('https://bit.ly/CRA-advanced-config')}`);
  console.log();
}

// We attempt to use the default port but if it is busy, we offer the user to
// run on a different port. `detect()` Promise resolves to the next free port.
checkBrowsers(paths.appPath, isInteractive)
  .then(() =>
    // We attempt to use the default port but if it is busy, we offer the user to
    // run on a different port. `choosePort()` Promise resolves to the next free port.
    choosePort(HOST, DEFAULT_PORT),
  )
  .then(port => {
    if (port === null) {
      // We have not found a port.
      return;
    }

    const appName = require(paths.packageJson).name;
    const config = configFactory('development');
    const protocol = process.env.HTTPS === 'true' ? 'https' : 'http';
    const urls = prepareUrls(protocol, HOST, port, paths.publicUrlOrPath.slice(0, -1));

    const compiler = createCompiler({ webpack, config, appName, urls });

    // Load proxy config
    const proxySetting = require(paths.packageJson).proxy;
    const proxyConfig = prepareProxy(proxySetting, paths.appAssets);
    // Serve webpack assets generated by the compiler over a web sever.
    const serverConfig = {
      ...createDevServerConfig(proxyConfig, urls.lanUrlForConfig),
      host: HOST,
      port,
    };

    const devServer = new WebpackDevServer(serverConfig, compiler);

    // Launch WebpackDevServer.
    devServer.startCallback(() => {
      if (isInteractive) {
        clearConsole();
      }

      console.log(chalk.cyan('Starting the development server...'));
      openBrowser(urls.localUrlForBrowser);
    });

    ['SIGINT', 'SIGTERM'].forEach(sig => {
      process.on(sig, () => {
        devServer.close();
        process.exit();
      });
    });
  })
  // eslint-disable-next-line unicorn/prefer-top-level-await
  .catch(error => {
    if (error && error.message) {
      console.log(error.message);
    }

    process.exit(1);
  });
