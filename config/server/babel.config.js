const {getTypeScriptModuleAliases} = require('../helpers');
const {clientRoot, tsConfigJSON} = require('../paths');

module.exports = {
  ignore: [
    clientRoot,
  ],
  sourceMaps: 'inline',
  presets: ['@babel/preset-typescript'],
  plugins: [
    // enable decorators
    [
      '@babel/plugin-proposal-decorators',
      {legacy: true},
    ],
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
    '@babel/plugin-transform-modules-commonjs',
  ],
};
