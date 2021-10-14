function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

export class BaseError extends Error {
  constructor(message = 'ERR-000 Неизвестная ошибка') {
    super(message);

    _defineProperty(this, "filename", 'unknown filename');

    _defineProperty(this, "position", -1);
  }

}
export class BaseTermError extends BaseError {
  constructor(columnName, message, termName = '', termParentName = '') {
    super(message);
    this.termName = termName;
    this.termParentName = termParentName;
    this.columnName = columnName;
  }

  toLogString() {
    const keys = ['filename', 'position', 'termName', 'termParentName', 'columnName', 'message'];
    return keys.map(k => this[k] ?? '').join('\t');
  }

  generateLogHeader() {
    return ['Имя файла', 'Номер строки', 'Название термина', 'Название родительского термина', 'Название колонки', 'Текст ошибки'].join('\t');
  }

}
export class BasePhysicsError extends BaseError {
  constructor(columnName, message, termName = '', termParentName = '', physicsPath = '') {
    super(message);
    this.termName = termName;
    this.termParentName = termParentName;
    this.columnName = columnName;
    this.physicsPath = physicsPath;
  }

  toLogString() {
    const keys = ['filename', 'position', 'termName', 'termParentName', 'physicsPath', 'columnName', 'message'];
    return `\n${keys.map(k => this[k] ?? '').join('\t')}`;
  }

  generateLogHeader() {
    return ['Имя файла', 'Номер строки', 'Название термина', 'Название родительского термина', 'Объект БД', 'Название колонки', 'Текст ошибки'].join('\t');
  }

}
//# sourceMappingURL=index.js.map