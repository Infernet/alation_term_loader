import { Alation, ITable } from 'alation_connector';
import { ITerm } from '../types';
import { ITermArticle } from '../types/alation';
import { IAlationEntity } from 'alation_connector/src/interfaces/entity';
import { HTMLElement } from 'node-html-parser';
export declare function getParentTerm(connector: Alation, parentTermName: string): Promise<ITermArticle>;
export declare function checkParentChildrenTermExists(parent: ITermArticle, term: ITerm): boolean;
export declare function setLineageTableField(connector: Alation, customFieldId: number, article: ITermArticle, table?: HTMLElement): Promise<boolean>;
export declare function setAlternativeNameField(connector: Alation, customFieldId: number, article: ITermArticle, alternativeName: string): Promise<boolean>;
export declare function setReferenceField(connector: Alation, customFieldId: number, term: ITermArticle, reference: string): Promise<boolean>;
export declare function getTableByPath(connector: Alation, path: string): Promise<ITable>;
export declare function getTermByPath(connector: Alation, parentName: string, termName: string): Promise<ITermArticle>;
export declare function updateStewardsField(connector: Alation, customFieldId: number, term: ITermArticle, emailList: string[]): Promise<void | string>;
export declare function checkSearchResult<T extends IAlationEntity>(result: T[]): T;
//# sourceMappingURL=index.d.ts.map