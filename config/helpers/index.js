const {readFileSync, realpathSync, existsSync} = require('fs');
const {resolve} = require('path');
const {moduleFileExtensions, REACT_APP} = require('../constants');

const appDirectory = realpathSync(process.cwd());

const getFileContent = (resolvePath) => {
  return eval(`(() => (${readFileSync(resolvePath, 'utf-8')}))()`);
};

const getFileNameTemplate = (isDevelopment, ext = 'js') => `static/js/${isDevelopment ? '[name]' : '[name].[contenthash:8]'}.${ext}`;

const getChunkFileNameTemplate = (isDevelopment, ext = 'js') => `static/js/${isDevelopment ? '[name].chunk' : '[name].chunk'}.${ext}`;

const getTypeScriptModuleAliases = (configPath, clientAliases = true) => {
  const aliases = {};

  const tsConfig = getFileContent(configPath);
  if (tsConfig?.compilerOptions?.paths) {
    for (const [name, path] of Object.entries(tsConfig.compilerOptions.paths)) {
      aliases[name] = clientAliases ? resolve(appDirectory, path[0]) : resolve('./', path[0]);
    }
  }
  return aliases;
};

const resolveApp = (relativePath) => resolve(appDirectory, relativePath);

const resolveModule = (resolveFn, filePath) => {
  const extension = moduleFileExtensions.find((extension) =>
    existsSync(resolveFn(`${filePath}.${extension}`)),
  );

  if (extension) {
    return resolveFn(`${filePath}.${extension}`);
  }

  return resolveFn(`${filePath}.js`);
};

const getClientEnvironment = () => {
  const raw = Object.keys(process.env).filter((key) => REACT_APP.test(key)).reduce(
      (env, key) => {
        env[key] = process.env[key];
        return env;
      },
      {
        NODE_ENV: process.env.NODE_ENV,
        PUBLIC_URL: process.env.NODE_ENV === 'development' ? '.' : (require(resolveApp('package.json'))?.homepage ?? '.'),
      },
  );
  const stringified = {
    'process.env': Object.keys(raw).reduce((env, key) => {
      env[key] = JSON.stringify(raw[key]);
      return env;
    }, {}),
  };

  return {raw, stringified};
};

const includeEnvironments = () => {
  const dotEnv = require('dotenv');
  const {developmentEnv, productionEnv, generalEnv, defaultEnv} = require('../paths');
  const isDevelopment = process.env.NODE_ENV === 'development';

  let result = dotEnv.config(
      {path: isDevelopment ? developmentEnv : productionEnv});

  if (result.error) {
    console.error(result.error.message);
    console.log('Try include general .env file...');
    result = dotEnv.config({path: generalEnv});
    if (result.error) {
      console.error(result.error.message);
      console.log('Try include default .env.default file...');
      result = dotEnv.config({path: defaultEnv});
      if (result.error) {
        console.error(result.error.message);
        process.exit(3);
      }
    }
  }
};

module.exports = {
  getFileContent,
  getFileNameTemplate,
  getChunkFileNameTemplate,
  getTypeScriptModuleAliases,
  resolveApp,
  resolveModule,
  getClientEnvironment,
  includeEnvironments,
};
