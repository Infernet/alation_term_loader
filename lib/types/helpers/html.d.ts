import { HTMLElement } from 'node-html-parser';
import { IAlationEntity, IAttribute, IDatasource, ISchema, ITable, ObjectType } from 'alation_connector';
import { Assign } from 'utility-types';
export declare function generateEntityLink(otype: ObjectType, entity: Assign<IAlationEntity, {
    url: string;
}>): HTMLElement;
export declare function generateTextElement(content: string): HTMLElement;
export declare function generateLineageTableRow(entityType: 'table', ds: IDatasource, schema: ISchema, table: ITable): HTMLElement;
export declare function generateLineageTableRow(entityType: 'attribute', ds: IDatasource, schema: ISchema, table: ITable, attribute: IAttribute): HTMLElement;
export declare function generateLink(url: string, parent?: HTMLElement | null, name?: string): HTMLElement;
export declare function generateLineageTable(): HTMLElement;
export declare function insertOrReplaceTableRow(table: HTMLElement, row: HTMLElement): HTMLElement;
//# sourceMappingURL=html.d.ts.map