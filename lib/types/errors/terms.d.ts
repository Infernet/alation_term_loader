import { BaseTermError } from './index';
export declare class UniqTermKeyTermError extends BaseTermError {
    constructor(termName?: string, termParentName?: string);
}
export declare class MissingRequireFieldTermError extends BaseTermError {
    constructor(columnName: string);
}
export declare class AlationTermError extends BaseTermError {
    constructor(columnName: string, message: string, termName?: string, termParentName?: string);
}
export declare class UnknownActionTermError extends BaseTermError {
    constructor(termName?: string, termParentName?: string);
}
export declare class UncorrectedReferenceTermError extends BaseTermError {
    constructor(termName?: string, termParentName?: string);
}
export declare class ParentTermNotFoundTermError extends BaseTermError {
    constructor(termName?: string, termParentName?: string);
}
export declare class ParentTermDuplicateTermError extends BaseTermError {
    constructor(termName?: string, termParentName?: string);
}
export declare class TermNotFoundTermError extends BaseTermError {
    constructor(termName?: string, termParentName?: string);
}
//# sourceMappingURL=terms.d.ts.map