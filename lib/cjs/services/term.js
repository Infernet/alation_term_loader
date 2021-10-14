"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.runTermService = runTermService;

var _types = require("../types");

var _fileReader = require("../helpers/fileReader");

var _parser = require("../helpers/parser");

var _terms = require("../errors/terms");

var _path = _interopRequireDefault(require("path"));

var _validator = require("../helpers/validator");

var _actions = require("../helpers/actions");

var _errors = require("../errors");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

async function runTermService(connector, config, filePath, skipHeader) {
  const records = (0, _fileReader.getTsvContent)(filePath, skipHeader);
  const termsCollection = new Map();

  for (let position = 0; position < records.length; position++) {
    if (!records[position].length) {
      continue;
    }

    const data = (0, _parser.parseTerm)(records[position]);
    const key = `${data.parentTermName}.${data.termName}`;

    if (termsCollection.has(key)) {
      // @ts-ignore
      termsCollection.get(key).push({
        data,
        position
      });
    } else {
      termsCollection.set(key, [{
        data,
        position
      }]);
    }
  }

  for (const [key, terms] of termsCollection) {
    if (terms.length > 1) {
      for (const {
        data,
        position
      } of terms) {
        const error = new _terms.UniqTermKeyTermError(data.termName, data.parentTermName);
        error.position = position;
        error.filename = _path.default.basename(filePath);
        (0, _fileReader.logError)(config.logPath, error);
      }

      termsCollection.delete(key);
      continue;
    }

    const {
      data,
      position
    } = terms[0];

    try {
      (0, _validator.validateTerm)(data);

      switch (data.action.toUpperCase()) {
        case _types.TermActionEnum.INSERT:
        case _types.TermActionEnum.DEFAULT:
          await (0, _actions.insertTerm)(connector, config.customFieldsId, data);
          break;

        case _types.TermActionEnum.UPDATE:
          await (0, _actions.updateTerm)(connector, config.customFieldsId, data);
          break;

        case _types.TermActionEnum.DELETE:
          await (0, _actions.deleteTerm)(connector, data);
      }
    } catch (e) {
      if (e instanceof _errors.BaseTermError) {
        e.termName = data.termName;
        e.termParentName = data.parentTermName;
        e.position = position + 1;
        e.filename = _path.default.basename(filePath);
        (0, _fileReader.logError)(config.logPath, e);
        continue;
      }

      throw e;
    }
  }
}
//# sourceMappingURL=term.js.map