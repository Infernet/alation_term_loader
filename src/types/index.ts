export enum TermActionEnum {
    // eslint-disable-next-line no-unused-vars
    DEFAULT = '',
    // eslint-disable-next-line no-unused-vars
    INSERT = 'I',
    // eslint-disable-next-line no-unused-vars
    UPDATE = 'U',
    // eslint-disable-next-line no-unused-vars
    DELETE = 'D',
}

export interface ITerm {
    parentTermName: string;
    termName: string;
    action: TermActionEnum;
    cluster: string;
    alternativeName: string;
    description: string;
    stewards: Array<string>;
    reference: string;
}

export interface IPhysic {
    parentTermName: string;
    termName: string;
    title: string;
    description: string;
    physicPath: string;
}

export type CollectionItem<T> = { data: T, position: number };

export type TermsCollection = Map<string, CollectionItem<ITerm>[]>;

export type PhysicsCollection = Map<string, CollectionItem<IPhysic>[]>;

export type ModeType = 'terms' | 'physics';

export type CustomFieldsIdCollection = {
    'lineageTable': number;
    'lineageRef': number;
    'alternativeName': number;
    'reference': number;
    'stewards': number;
}

export interface IConfig {
    host: string;
    username: string;
    password: string;
    logPath: string;
    tokenName: string;
    tokenStoragePath: string;
    customFieldsId: CustomFieldsIdCollection;
}


export interface TerminalAnswer {
    inputConfigPath: string;
    inputMode: ModeType;
    inputFilePath: string;
    inputSkipHeader: boolean;
}
