"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.TermNotFoundTermError = exports.ParentTermDuplicateTermError = exports.ParentTermNotFoundTermError = exports.UncorrectedReferenceTermError = exports.UnknownActionTermError = exports.AlationTermError = exports.MissingRequireFieldTermError = exports.UniqTermKeyTermError = void 0;

var _index = require("./index");

class UniqTermKeyTermError extends _index.BaseTermError {
  constructor(termName = '', termParentName = '') {
    super('Родительский термин,Термин', 'ERR-001 Не уникальное сочетание родительского термина и термина', termName, termParentName);
  }

}

exports.UniqTermKeyTermError = UniqTermKeyTermError;

class MissingRequireFieldTermError extends _index.BaseTermError {
  constructor(columnName) {
    super(columnName, 'ERR-002 Обязательное поле не заполнено');
  }

}

exports.MissingRequireFieldTermError = MissingRequireFieldTermError;

class AlationTermError extends _index.BaseTermError {
  constructor(columnName, message, termName = '', termParentName = '') {
    super(columnName, `ERR-003 ошибка при обращении к api Alation: ${message}`, termName, termParentName);
  }

}

exports.AlationTermError = AlationTermError;

class UnknownActionTermError extends _index.BaseTermError {
  constructor(termName = '', termParentName = '') {
    super('Action', 'ERR-004 Неизвестное значение Action', termName, termParentName);
  }

}

exports.UnknownActionTermError = UnknownActionTermError;

class UncorrectedReferenceTermError extends _index.BaseTermError {
  constructor(termName = '', termParentName = '') {
    super('Reference', 'ERR-005 Неверный формат поля Reference, проверьте правильность ввода', termName, termParentName);
  }

}

exports.UncorrectedReferenceTermError = UncorrectedReferenceTermError;

class ParentTermNotFoundTermError extends _index.BaseTermError {
  constructor(termName = '', termParentName = '') {
    super('Родительский термин', 'ERR-006 Родительский термин не существует', termName, termParentName);
  }

}

exports.ParentTermNotFoundTermError = ParentTermNotFoundTermError;

class ParentTermDuplicateTermError extends _index.BaseTermError {
  constructor(termName = '', termParentName = '') {
    super('Родительский термин', 'ERR-007 В Alation существует два родительских термина с данным' + ' названием - исправьте перед загрузкой данного файла', termName, termParentName);
  }

}

exports.ParentTermDuplicateTermError = ParentTermDuplicateTermError;

class TermNotFoundTermError extends _index.BaseTermError {
  constructor(termName = '', termParentName = '') {
    super('Термин', 'ERR-008 Термин не существует', termName, termParentName);
  }

}

exports.TermNotFoundTermError = TermNotFoundTermError;
//# sourceMappingURL=terms.js.map