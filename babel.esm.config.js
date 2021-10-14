const {readFileSync} = require('fs');
const {resolve} = require('path');

// paths
const tsConfigJSON = resolve('tsconfig.json');

// helpers
const getFileContent = (resolvePath) => {
  return eval(`(() => (${readFileSync(resolvePath, 'utf-8')}))()`);
};

const getTypeScriptModuleAliases = (configPath) => {
  const aliases = {};

  const tsConfig = getFileContent(configPath);
  if (tsConfig?.compilerOptions?.paths) {
    for (const [name, path] of Object.entries(tsConfig.compilerOptions.paths)) {
      aliases[name] = resolve('./', path[0]);
    }
  }
  return aliases;
};

module.exports = {
  ignore: [],
  sourceMaps: 'inline',
  presets: ['@babel/preset-typescript'],
  plugins: [
    // enable TypeScript code
    '@babel/transform-typescript',
    '@babel/syntax-typescript',
    // proposals
    '@babel/plugin-proposal-optional-chaining',
    [
      '@babel/plugin-proposal-class-properties',
      {legacy: true},
    ],
    // module-resolve
    [
      'module-resolver',
      {
        root: ['./'],
        alias: getTypeScriptModuleAliases(tsConfigJSON, false),
      },
    ],
  ],
};
