import { BasePhysicsError } from './index';
export declare class UniqKeyPhysicsError extends BasePhysicsError {
    constructor(termName?: string, termParentName?: string, physicsPath?: string);
}
export declare class MissingRequireFieldPhysicError extends BasePhysicsError {
    constructor(columnName: string);
}
export declare class UncorrectedPathFormatPhysicError extends BasePhysicsError {
    constructor();
}
export declare class ParentTermNotFoundPhysicError extends BasePhysicsError {
    constructor();
}
export declare class ParentTermDuplicatePhysicError extends BasePhysicsError {
    constructor();
}
export declare class TermNotFoundPhysicError extends BasePhysicsError {
    constructor();
}
export declare class EntityNotFoundError extends BasePhysicsError {
    constructor();
}
export declare class DuplicateEntityError extends BasePhysicsError {
    constructor();
}
//# sourceMappingURL=physics.d.ts.map