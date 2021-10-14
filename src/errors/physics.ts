import {BasePhysicsError} from './index';
import {PHYSIC_COLUMN_NAMES} from '../constants';

export class UniqKeyPhysicsError extends BasePhysicsError {
  constructor(termName = '', termParentName = '', physicsPath = '') {
    super(
        [
          PHYSIC_COLUMN_NAMES.parentTermName,
          PHYSIC_COLUMN_NAMES.termName,
          PHYSIC_COLUMN_NAMES.physicPath,
        ].join(','),
        'ERR-100  Не уникальное сочетание родительского термина и термина',
        termName,
        termParentName,
        physicsPath,
    );
  }
}

export class MissingRequireFieldPhysicError extends BasePhysicsError {
  constructor(columnName: string) {
    super(columnName, 'ERR-101 Обязательное поле не заполнено');
  }
}

export class UncorrectedPathFormatPhysicError extends BasePhysicsError {
  constructor() {
    super(PHYSIC_COLUMN_NAMES.physicPath, 'ERR-102 Объект БД неверного формата');
  }
}

export class ParentTermNotFoundPhysicError extends BasePhysicsError {
  constructor() {
    super(PHYSIC_COLUMN_NAMES.parentTermName, 'ERR-103 Родительский термин не существует');
  }
}

export class ParentTermDuplicatePhysicError extends BasePhysicsError {
  constructor() {
    super(PHYSIC_COLUMN_NAMES.parentTermName, 'ERR-104 В Alation существует два родительских термина с данным' +
        ' названием - исправьте перед загрузкой данного файла');
  }
}

export class TermNotFoundPhysicError extends BasePhysicsError {
  constructor() {
    super(PHYSIC_COLUMN_NAMES.termName, 'ERR-105 Термин не существует');
  }
}

export class EntityNotFoundError extends BasePhysicsError {
  constructor() {
    super(PHYSIC_COLUMN_NAMES.physicPath, 'ERR-106 По данному пути сущности не найдено в Alation');
  }
}

export class DuplicateEntityError extends BasePhysicsError {
  constructor() {
    super(PHYSIC_COLUMN_NAMES.physicPath, 'ERR-107 По данному пути сущности найдено несколько сущностей Alation');
  }
}
