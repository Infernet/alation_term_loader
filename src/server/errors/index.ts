export interface ITermErrorLogDataBase {
    filename: string;
    position: number;
    columnName: string;
    message: string;
    termName: string;
    parent: string;
}

export type ITermLogData = Omit<Omit<ITermErrorLogDataBase, 'message'>, 'columnName'>;

export class BaseTermError extends Error {
    protected filename: string;
    protected position: number;
    protected termName: string;
    protected parent: string;
    protected columnName = '';
    protected errorMessage = '';

    constructor({filename, termName, parent, position}: ITermLogData) {
      super();
      this.filename = filename;
      this.position = position;
      this.termName = termName;
      this.parent = parent;
    }

    getLog(): ITermErrorLogDataBase {
      return {
        filename: this.filename,
        columnName: this.columnName,
        message: this.errorMessage,
        position: this.position,
        parent: this.parent,
        termName: this.termName,
      };
    }
}

export class UniqTermKeyError extends BaseTermError {
  constructor(log: ITermLogData) {
    super(log);
    this.columnName='Родительский термин,Термин';
    this.errorMessage = 'ERR-002 Не уникальное сочетание родительского термина и термина';
  }
}

export class ParentTermNotFoundError extends BaseTermError {
  constructor(log: ITermLogData) {
    super(log);
    this.columnName='Родительский термин';
    this.errorMessage = 'ERR-004 Родительский термин не существует';
  }
}

export class ParentTermDuplicateError extends BaseTermError {
  constructor(log: ITermLogData) {
    super(log);
    this.columnName='Родительский термин';
    this.errorMessage = 'ERR-005 В Alation существует два родительских термина с данным' +
        ' названием - исправьте перед загрузкой данного файла';
  }
}

export class TermExistsError extends BaseTermError {
  constructor(log: ITermLogData) {
    super(log);
    this.columnName='Термин';
    this.errorMessage = 'ERR-001 Термин уже существует';
  }
}

export class TermNotFoundError extends BaseTermError {
  constructor(log: ITermLogData) {
    super(log);
    this.columnName='Термин';
    this.errorMessage = 'ERR-003 Термин не существует';
  }
}

export class EmptyBodyError extends BaseTermError {
  constructor(log: ITermLogData) {
    super(log);
    this.columnName='Описание';
    this.errorMessage = 'ERR-007 Поле описание не может быть пустым';
  }
}

export class UnknownActionError extends BaseTermError {
  constructor(log: ITermLogData) {
    super(log);
    this.columnName='Action';
    this.errorMessage = 'ERR-008 Неизвестное значение Action';
  }
}

export class UncorrectedReferenceError extends BaseTermError {
  constructor(log: ITermLogData) {
    super(log);
    this.columnName='Reference';
    this.errorMessage = 'ERR-009 Неверный формат поля Reference, проверьте правильность ввода';
  }
}


