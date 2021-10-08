const {resolveApp, resolveModule} = require('./helpers');

const packageJSON = resolveApp('package.json');

module.exports = {
  // config
  packageJSON,
  tsConfigJSON: resolveApp('tsconfig.json'),
  generalEnv: resolveApp('.env'),
  defaultEnv: resolveApp('.env.default'),
  developmentEnv: resolveApp('.env.development'),
  productionEnv: resolveApp('.env.production'),
  // client
  clientRoot: resolveApp('src/client'),
  clientBuildRoot: resolveApp('dist/public'),
  clientIndex: resolveModule(resolveApp, 'src/client/index'),
  htmlTemplate: resolveApp('public/index.html'),
  // serve
  serverRoot: resolveApp('src/server'),
  serverBuildRoot: resolveApp('dist/server'),
  serverIndex: resolveModule(resolveApp, 'src/server/index'),
  // general
  publicRoot: resolveApp('public'),
  root: resolveApp('src'),
  nodeModules: resolveApp('node_modules'),
  publicUrlOrPath: process.env.NODE_ENV === 'development' ? '' : (require(packageJSON)?.homepage ?? '.'),
};
