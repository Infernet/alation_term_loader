"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.PHYSICS_FIELDS_POSITION = exports.TERM_FIELDS_POSITION = exports.PHYSIC_COLUMN_NAMES = exports.TERM_COLUMN_NAMES = exports.getPhysicsLogPath = exports.getTermsLogPath = void 0;

var _path = _interopRequireDefault(require("path"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

const getTermsLogPath = base => _path.default.join(base, 'term_log.tsv');

exports.getTermsLogPath = getTermsLogPath;

const getPhysicsLogPath = base => _path.default.join(base, 'physics_log.tsv'); // eslint-disable-next-line no-unused-vars


exports.getPhysicsLogPath = getPhysicsLogPath;
const TERM_COLUMN_NAMES = {
  parentTermName: 'Родительский термин',
  termName: 'Термин',
  action: 'Action',
  cluster: 'Кластер данных',
  alternativeName: 'Alternative name',
  description: 'Описание',
  stewards: 'Steward',
  reference: 'Reference'
}; // eslint-disable-next-line no-unused-vars

exports.TERM_COLUMN_NAMES = TERM_COLUMN_NAMES;
const PHYSIC_COLUMN_NAMES = {
  parentTermName: 'Родительский термин',
  termName: 'Термин',
  title: 'Название',
  description: 'Описание',
  physicPath: 'Объект БД'
}; // eslint-disable-next-line no-unused-vars

exports.PHYSIC_COLUMN_NAMES = PHYSIC_COLUMN_NAMES;
const TERM_FIELDS_POSITION = {
  parentTermName: 0,
  termName: 1,
  action: 2,
  cluster: 3,
  alternativeName: 4,
  description: 5,
  stewards: 6,
  reference: 7
}; // eslint-disable-next-line no-unused-vars

exports.TERM_FIELDS_POSITION = TERM_FIELDS_POSITION;
const PHYSICS_FIELDS_POSITION = {
  parentTermName: 0,
  termName: 1,
  title: 2,
  description: 3,
  physicPath: 4
};
exports.PHYSICS_FIELDS_POSITION = PHYSICS_FIELDS_POSITION;
//# sourceMappingURL=index.js.map