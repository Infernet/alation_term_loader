export abstract class BaseError extends Error {
    public filename = 'unknown filename';
    public position = -1;

    protected constructor(message = 'ERR-000 Неизвестная ошибка') {
      super(message);
    }

    abstract toLogString(): string;

    abstract generateLogHeader(): string;
}


export abstract class BaseTermError extends BaseError {
    public termName: string;
    public termParentName: string;
    public columnName: string;


    protected constructor(columnName: string, message: string, termName = '', termParentName = '') {
      super(message);
      this.termName = termName;
      this.termParentName = termParentName;
      this.columnName = columnName;
    }

    toLogString(): string {
      const keys: (keyof BaseTermError)[] = [
        'filename',
        'position',
        'termName',
        'termParentName',
        'columnName',
        'message',
      ];
      return keys.map((k) => (this[k] ?? '')).join('\t');
    }

    generateLogHeader(): string {
      return [
        'Имя файла',
        'Номер строки',
        'Название термина',
        'Название родительского термина',
        'Название колонки',
        'Текст ошибки',
      ].join('\t');
    }
}


export abstract class BasePhysicsError extends BaseError {
    public termName: string;
    public termParentName: string;
    public physicsPath: string;
    public columnName: string;


    protected constructor(columnName: string, message: string, termName = '', termParentName = '', physicsPath = '' ) {
      super(message);
      this.termName = termName;
      this.termParentName = termParentName;
      this.columnName = columnName;
      this.physicsPath = physicsPath;
    }

    toLogString(): string {
      const keys: (keyof BasePhysicsError)[] = [
        'filename',
        'position',
        'termName',
        'termParentName',
        'physicsPath',
        'columnName',
        'message',
      ];
      return `\n${keys.map((k) => (this[k] ?? '')).join('\t')}`;
    }


    generateLogHeader(): string {
      return [
        'Имя файла',
        'Номер строки',
        'Название термина',
        'Название родительского термина',
        'Объект БД',
        'Название колонки',
        'Текст ошибки',
      ].join('\t');
    }
}
