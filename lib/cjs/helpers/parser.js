"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.parseTerm = parseTerm;
exports.parsePhysics = parsePhysics;

var _constants = require("../constants");

function parseTerm(content) {
  const columns = content.split('\t');
  const result = {};

  for (const [fieldName, position] of Object.entries(_constants.TERM_FIELDS_POSITION)) {
    if (fieldName === 'stewards') {
      result[fieldName] = columns[position].split(',');
      continue;
    } // @ts-ignore


    result[fieldName] = columns[position];
  }

  return result;
}

function parsePhysics(content) {
  const columns = content.split('\t');
  const result = {};

  for (const [fieldName, position] of Object.entries(_constants.PHYSICS_FIELDS_POSITION)) {
    // @ts-ignore
    result[fieldName] = columns[position];
  }

  return result;
}
//# sourceMappingURL=parser.js.map