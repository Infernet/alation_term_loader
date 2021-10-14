"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.runPhysicService = runPhysicService;

var _fileReader = require("../helpers/fileReader");

var _parser = require("../helpers/parser");

var _path = _interopRequireDefault(require("path"));

var _validator = require("../helpers/validator");

var _actions = require("../helpers/actions");

var _errors = require("../errors");

var _physics = require("../errors/physics");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

async function runPhysicService(connector, config, filePath, skipHeader) {
  const records = (0, _fileReader.getTsvContent)(filePath, skipHeader);
  const physicsCollection = new Map();

  for (let position = 0; position < records.length; position++) {
    if (!records[position].length) {
      continue;
    }

    const data = (0, _parser.parsePhysics)(records[position]);
    const key = `${data.parentTermName}.${data.termName}.${data.physicPath}`;

    if (physicsCollection.has(key)) {
      // @ts-ignore
      physicsCollection.get(key).push({
        data,
        position
      });
    } else {
      physicsCollection.set(key, [{
        data,
        position
      }]);
    }
  }

  for (const [key, physic] of physicsCollection) {
    if (physic.length > 1) {
      for (const {
        data,
        position
      } of physic) {
        const error = new _physics.UniqKeyPhysicsError(data.termName, data.parentTermName, data.physicPath);
        error.position = position;
        error.filename = _path.default.basename(filePath);
        (0, _fileReader.logError)(config.logPath, error);
      }

      physicsCollection.delete(key);
      continue;
    }

    const {
      data,
      position
    } = physic[0];

    try {
      (0, _validator.validatePhysic)(data);
      await (0, _actions.uploadPhysic)(connector, config.customFieldsId, data);
    } catch (e) {
      if (e instanceof _errors.BasePhysicsError) {
        e.termName = data.termName;
        e.termParentName = data.parentTermName;
        e.physicsPath = data.physicPath;
        e.position = position + 1;
        e.filename = _path.default.basename(filePath);
        (0, _fileReader.logError)(config.logPath, e);
        continue;
      }

      throw e;
    }
  }
}
//# sourceMappingURL=physics.js.map