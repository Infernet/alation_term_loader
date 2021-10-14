"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.getTsvContent = getTsvContent;
exports.logError = logError;

var _fsExtra = _interopRequireDefault(require("fs-extra"));

var _errors = require("../errors");

var _constants = require("../constants");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function getTsvContent(path, skipHeader = false) {
  const content = _fsExtra.default.readFileSync(path, {
    encoding: 'utf-8'
  });

  const records = content.split('\n');

  if (skipHeader) {
    records[0] = '';
  }

  return records;
}

function logError(path, error) {
  const filepath = error instanceof _errors.BaseTermError ? (0, _constants.getTermsLogPath)(path) : (0, _constants.getPhysicsLogPath)(path);

  if (_fsExtra.default.existsSync(filepath)) {
    _fsExtra.default.appendFileSync(filepath, `\n${error.toLogString()}`, {
      encoding: 'utf-8'
    });
  } else {
    _fsExtra.default.outputFileSync(filepath, [error.generateLogHeader(), error.toLogString()].join('\n'), {
      encoding: 'utf-8'
    });
  }
}
//# sourceMappingURL=fileReader.js.map