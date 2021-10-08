export enum TermActionEnum {
    INSERT = 'I',
    UPDATE = 'U',
    DELETE = 'D',
}

export interface ITerm {
    parent: string;
    name: string;
    action: TermActionEnum;
    cluster: string;
    alternativeName: string;
    body: string;
    stewards: Array<string>;
    reference: string;
    filename: string;
    position: number;
}
