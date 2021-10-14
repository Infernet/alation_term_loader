export declare abstract class BaseError extends Error {
    filename: string;
    position: number;
    protected constructor(message?: string);
    abstract toLogString(): string;
    abstract generateLogHeader(): string;
}
export declare abstract class BaseTermError extends BaseError {
    termName: string;
    termParentName: string;
    columnName: string;
    protected constructor(columnName: string, message: string, termName?: string, termParentName?: string);
    toLogString(): string;
    generateLogHeader(): string;
}
export declare abstract class BasePhysicsError extends BaseError {
    termName: string;
    termParentName: string;
    physicsPath: string;
    columnName: string;
    protected constructor(columnName: string, message: string, termName?: string, termParentName?: string, physicsPath?: string);
    toLogString(): string;
    generateLogHeader(): string;
}
//# sourceMappingURL=index.d.ts.map