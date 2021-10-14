"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.validateTerm = validateTerm;
exports.validatePhysic = validatePhysic;
exports.validateCustomFieldId = validateCustomFieldId;

var _terms = require("../errors/terms");

var _constants = require("../constants");

var _physics = require("../errors/physics");

function validateTerm(term) {
  if (!term.parentTermName.length) {
    throw new _terms.MissingRequireFieldTermError(_constants.TERM_COLUMN_NAMES.parentTermName);
  }

  if (!term.termName.length) {
    throw new _terms.MissingRequireFieldTermError(_constants.TERM_COLUMN_NAMES.termName);
  }

  if (!(term.action === '' || term.action.toUpperCase() === 'I' || term.action.toUpperCase() === 'U' || term.action.toUpperCase() === 'D')) {
    throw new _terms.UnknownActionTermError();
  }

  if (!term.description.length) {
    throw new _terms.MissingRequireFieldTermError(_constants.TERM_COLUMN_NAMES.description);
  }

  if (term.reference.split('.').length !== 3) {
    throw new _terms.UncorrectedReferenceTermError(term.termName, term.parentTermName);
  }
}

function validatePhysic(physic) {
  if (!physic.parentTermName.length) {
    throw new _physics.MissingRequireFieldPhysicError(_constants.PHYSIC_COLUMN_NAMES.parentTermName);
  }

  if (!physic.termName.length) {
    throw new _physics.MissingRequireFieldPhysicError(_constants.PHYSIC_COLUMN_NAMES.termName);
  }

  if (!physic.physicPath.length) {
    throw new _physics.MissingRequireFieldPhysicError(_constants.PHYSIC_COLUMN_NAMES.physicPath);
  }

  if (physic.physicPath.split('.').length < 3 || physic.physicPath.split('.').length > 4) {
    throw new _physics.UncorrectedPathFormatPhysicError();
  }
}

function validateCustomFieldId(customFields) {
  const keys = ['lineageTable', 'lineageRef', 'alternativeName', 'reference', 'stewards'];

  if (!customFields) {
    throw new Error('В конфигурационном файле отсутствуют идентификаторы custom fields');
  }

  for (const k of keys) {
    if (typeof customFields[k] !== 'number') {
      throw new Error(`В конфигурационном файле отсутствуют идентификатор custom fields ${k}`);
    }
  }
}
//# sourceMappingURL=validator.js.map