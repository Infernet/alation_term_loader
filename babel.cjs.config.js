const config = require('./babel.esm.config');
config.plugins.push('@babel/plugin-transform-modules-commonjs');
module.exports = config;
