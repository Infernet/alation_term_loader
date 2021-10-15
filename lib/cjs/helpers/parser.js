"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.parseTerm = parseTerm;
exports.parsePhysics = parsePhysics;

var _constants = require("../constants");

function parseTerm(content) {
  const columns = content.split('\t').map(e => e.trim());
  const result = {};

  for (const [fieldName, position] of Object.entries(_constants.TERM_FIELDS_POSITION)) {
    var _columns$position2;

    if (fieldName === 'stewards') {
      var _columns$position;

      result[fieldName] = (_columns$position = columns[position]) !== null && _columns$position !== void 0 && _columns$position.length ? columns[position].split(',') : [];
      continue;
    } // @ts-ignore


    result[fieldName] = ((_columns$position2 = columns[position]) === null || _columns$position2 === void 0 ? void 0 : _columns$position2.trim()) ?? '';
  }

  return result;
}

function parsePhysics(content) {
  const columns = content.split('\t').map(e => e.trim());
  const result = {};

  for (const [fieldName, position] of Object.entries(_constants.PHYSICS_FIELDS_POSITION)) {
    var _columns$position3;

    // @ts-ignore
    result[fieldName] = ((_columns$position3 = columns[position]) === null || _columns$position3 === void 0 ? void 0 : _columns$position3.trim()) ?? '';
  }

  return result;
}
//# sourceMappingURL=parser.js.map