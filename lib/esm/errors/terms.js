import { BaseTermError } from "./index";
export class UniqTermKeyTermError extends BaseTermError {
  constructor(termName = '', termParentName = '') {
    super('Родительский термин,Термин', 'ERR-001 Не уникальное сочетание родительского термина и термина', termName, termParentName);
  }

}
export class MissingRequireFieldTermError extends BaseTermError {
  constructor(columnName) {
    super(columnName, 'ERR-002 Обязательное поле не заполнено');
  }

}
export class AlationTermError extends BaseTermError {
  constructor(columnName, message, termName = '', termParentName = '') {
    super(columnName, `ERR-003 ошибка при обращении к api Alation: ${message}`, termName, termParentName);
  }

}
export class UnknownActionTermError extends BaseTermError {
  constructor(termName = '', termParentName = '') {
    super('Action', 'ERR-004 Неизвестное значение Action', termName, termParentName);
  }

}
export class UncorrectedReferenceTermError extends BaseTermError {
  constructor(termName = '', termParentName = '') {
    super('Reference', 'ERR-005 Неверный формат поля Reference, проверьте правильность ввода', termName, termParentName);
  }

}
export class ParentTermNotFoundTermError extends BaseTermError {
  constructor(termName = '', termParentName = '') {
    super('Родительский термин', 'ERR-006 Родительский термин не существует', termName, termParentName);
  }

}
export class ParentTermDuplicateTermError extends BaseTermError {
  constructor(termName = '', termParentName = '') {
    super('Родительский термин', 'ERR-007 В Alation существует два родительских термина с данным' + ' названием - исправьте перед загрузкой данного файла', termName, termParentName);
  }

}
export class TermNotFoundTermError extends BaseTermError {
  constructor(termName = '', termParentName = '') {
    super('Термин', 'ERR-008 Термин не существует', termName, termParentName);
  }

}
//# sourceMappingURL=terms.js.map