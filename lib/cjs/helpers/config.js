"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.loadConfig = loadConfig;

var _fsExtra = _interopRequireDefault(require("fs-extra"));

var _path = require("path");

var _validator = require("./validator");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function loadConfig(path) {
  const {
    username,
    logPath,
    tokenStoragePath,
    tokenName,
    host,
    password,
    customFieldsId
  } = JSON.parse(_fsExtra.default.readFileSync(path, {
    encoding: 'utf-8'
  }));

  if (!username || !password) {
    throw new Error('Отсутствуют данные авторизации пользователя');
  }

  if (!host) {
    throw new Error('Отсутствует информация о хосте');
  }

  (0, _validator.validateCustomFieldId)(customFieldsId);
  return {
    username,
    password,
    host,
    tokenName: tokenName ? tokenName : 'term_loader_token',
    tokenStoragePath: (0, _path.isAbsolute)(tokenStoragePath) ? tokenStoragePath : (0, _path.join)(process.cwd(), tokenStoragePath),
    logPath: (0, _path.isAbsolute)(logPath) ? logPath : (0, _path.join)(process.cwd(), logPath),
    customFieldsId
  };
}
//# sourceMappingURL=config.js.map