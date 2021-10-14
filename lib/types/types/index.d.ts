export declare enum TermActionEnum {
    DEFAULT = "",
    INSERT = "I",
    UPDATE = "U",
    DELETE = "D"
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
export declare type CollectionItem<T> = {
    data: T;
    position: number;
};
export declare type TermsCollection = Map<string, CollectionItem<ITerm>[]>;
export declare type PhysicsCollection = Map<string, CollectionItem<IPhysic>[]>;
export declare type ModeType = 'terms' | 'physics';
export declare type CustomFieldsIdCollection = {
    'lineageTable': number;
    'lineageRef': number;
    'alternativeName': number;
    'reference': number;
    'stewards': number;
};
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
//# sourceMappingURL=index.d.ts.map