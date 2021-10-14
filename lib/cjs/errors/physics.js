"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.DuplicateEntityError = exports.EntityNotFoundError = exports.TermNotFoundPhysicError = exports.ParentTermDuplicatePhysicError = exports.ParentTermNotFoundPhysicError = exports.UncorrectedPathFormatPhysicError = exports.MissingRequireFieldPhysicError = exports.UniqKeyPhysicsError = void 0;

var _index = require("./index");

var _constants = require("../constants");

class UniqKeyPhysicsError extends _index.BasePhysicsError {
  constructor(termName = '', termParentName = '', physicsPath = '') {
    super([_constants.PHYSIC_COLUMN_NAMES.parentTermName, _constants.PHYSIC_COLUMN_NAMES.termName, _constants.PHYSIC_COLUMN_NAMES.physicPath].join(','), 'ERR-100  Не уникальное сочетание родительского термина и термина', termName, termParentName, physicsPath);
  }

}

exports.UniqKeyPhysicsError = UniqKeyPhysicsError;

class MissingRequireFieldPhysicError extends _index.BasePhysicsError {
  constructor(columnName) {
    super(columnName, 'ERR-101 Обязательное поле не заполнено');
  }

}

exports.MissingRequireFieldPhysicError = MissingRequireFieldPhysicError;

class UncorrectedPathFormatPhysicError extends _index.BasePhysicsError {
  constructor() {
    super(_constants.PHYSIC_COLUMN_NAMES.physicPath, 'ERR-102 Объект БД неверного формата');
  }

}

exports.UncorrectedPathFormatPhysicError = UncorrectedPathFormatPhysicError;

class ParentTermNotFoundPhysicError extends _index.BasePhysicsError {
  constructor() {
    super(_constants.PHYSIC_COLUMN_NAMES.parentTermName, 'ERR-103 Родительский термин не существует');
  }

}

exports.ParentTermNotFoundPhysicError = ParentTermNotFoundPhysicError;

class ParentTermDuplicatePhysicError extends _index.BasePhysicsError {
  constructor() {
    super(_constants.PHYSIC_COLUMN_NAMES.parentTermName, 'ERR-104 В Alation существует два родительских термина с данным' + ' названием - исправьте перед загрузкой данного файла');
  }

}

exports.ParentTermDuplicatePhysicError = ParentTermDuplicatePhysicError;

class TermNotFoundPhysicError extends _index.BasePhysicsError {
  constructor() {
    super(_constants.PHYSIC_COLUMN_NAMES.termName, 'ERR-105 Термин не существует');
  }

}

exports.TermNotFoundPhysicError = TermNotFoundPhysicError;

class EntityNotFoundError extends _index.BasePhysicsError {
  constructor() {
    super(_constants.PHYSIC_COLUMN_NAMES.physicPath, 'ERR-106 По данному пути сущности не найдено в Alation');
  }

}

exports.EntityNotFoundError = EntityNotFoundError;

class DuplicateEntityError extends _index.BasePhysicsError {
  constructor() {
    super(_constants.PHYSIC_COLUMN_NAMES.physicPath, 'ERR-107 По данному пути сущности найдено несколько сущностей Alation');
  }

}

exports.DuplicateEntityError = DuplicateEntityError;
//# sourceMappingURL=physics.js.map